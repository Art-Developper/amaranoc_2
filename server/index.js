import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
import { houses, salesHouses, discounts, servicesData, sectionData, prices } from "./data.js";

dotenv.config();

// --- 1. MONGODB USER MODEL ---
const userSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    bookings: { type: Array, default: [] }
});
const User = mongoose.model("User", userSchema);

let app = express();

// --- 2. MIDDLEWARES ---
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: "MarmokJohanOlegCoffiJanagaCristianoRonaldoMessiLeonel",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // localhost-ի համար
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- 3. PASSPORT STRATEGY ---
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: "Օգտատերը չի գտնվել" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: "Սխալ գաղտնաբառ" });

            return done(null, user);
        } catch (err) { return done(err); }
    }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) { done(err); }
});

// --- 4. API ROUTES ---

// Register
app.post("/api/register", async (req, res) => {
    try {
        const { name, phoneNumber, email, password } = req.body;
        const usrExists = await User.findOne({ email });

        if (usrExists) {
            return res.status(400).json({ success: false, message: "Այս էլ. հասցեն արդեն գրանցված է" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUsr = new User({
            name, phoneNumber, email, password: hashedPassword, bookings: []
        });

        await newUsr.save();
        res.status(201).json({ success: true, message: "Գրանցումը հաջողվեց" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Սերվերի սխալ" });
    }
});

// Login
app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(500).json({ success: false, message: "Սերվերի սխալ" });
        if (!user) return res.status(401).json({ success: false, message: info.message });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ success: false, message: "Մուտքի սխալ" });
            return res.json({ success: true, message: "Բարի գալուստ", user: { name: user.name, email: user.email } });
        });
    })(req, res, next);
});

// Profile
app.get("/api/profile", async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.user.id);
        return res.json(user);
    }
    res.status(401).json({ message: "Not authenticated" });
});

// Booking
app.post("/api/book", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Մուտք գործեք" });

    const { type, houseId, startDate, endDate, guests, totalPrice, contactInfo, details } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Օգտատերը չի գտնվել" });

        let newBooking = {
            id: Date.now(),
            type: type || 'house',
            totalPrice,
            contactInfo,
            bookedAt: new Date()
        };

        if (type === 'giftcard' || type === 'service') {
            newBooking.details = details;
        } else {
            const bookedHouse = houses.find(h => h.id === parseInt(houseId));
            newBooking.startDate = startDate;
            newBooking.endDate = endDate;
            newBooking.guests = guests;
            newBooking.houseDetails = {
                location: bookedHouse?.location,
                image: Array.isArray(bookedHouse?.image) ? bookedHouse.image[0] : bookedHouse?.image
            };
        }

        user.bookings.push(newBooking);
        await user.save();

        res.json({ success: true, message: "Ամրագրումը հաջողվեց" });
    } catch (error) {
        res.status(500).json({ message: "Սերվերի սխալ" });
    }
});

// Update User
app.put("/api/user/update", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Մուտք գործած չեք" });
    const { name, phoneNumber } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, phoneNumber }, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch (error) { res.status(500).json({ message: "Սխալ թարմացման ժամանակ" }); }
});

// Delete User
app.delete("/api/user/delete", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Մուտք գործած չեք" });
    try {
        await User.findByIdAndDelete(req.user.id);
        req.logout(() => res.json({ success: true }));
    } catch (error) { res.status(500).json({ message: "Սխալ ջնջման ժամանակ" }); }
});

// Data routes
app.get("/api/houses/:id", (req, res) => {
    const house = houses.find(h => h.id === parseInt(req.params.id));
    res.json(house || { message: "Չի գտնվել" });
});

app.get("/api/houses", (req, res) => {
    const { search, region } = req.query;
    let result = [...houses];
    if (search) {
        const regex = new RegExp(search.split("").join(".*"), "i");
        result = result.filter(h => regex.test(h.location));
    }
    if (region) {
        const regArr = Array.isArray(region) ? region : [region];
        result = result.filter(h => regArr.some(r => h.location.includes(r)));
    }
    res.json(result);
});

app.get("/api/services", (req, res) => res.json(servicesData));
app.get("/api/sales", (req, res) => res.json({ discounts, prices, salesHouses }));
app.get("/api/about", (req, res) => res.json(sectionData));

app.post("/api/logout", (req, res) => {
    req.logout(() => res.json({ success: true }));
});

// --- 5. CONNECT AND START ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));