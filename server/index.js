import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { houses, salesHouses, discounts, servicesData, sectionData, prices } from "./data.js";


dotenv.config();
const users = [];


let app = express();

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
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = users.find(u => u.email === email)
            if (!user) {
                return done(null, false, { message: "Օգտատերը չի գտնվել" })
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Սխալ գաղտնաբառ" });
            }

            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }
))

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user)
});

app.post("/api/register", async (req, res) => {
    try {
        const { name, phoneNumber, email, password } = req.body

        const usrExists = users.find(u => u.email === email);

        if (usrExists) {
            return res.status(400).json({ success: false, message: "Այս էլ. հասցեն արդեն գրանցված է" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUsr = {
            id: Date.now(),
            name,
            phoneNumber,
            email,
            password: hashedPassword,
            bookings: []
        };
        users.push(newUsr)
        res.status(201).json({ success: true, message: "Գրանցումը հաջողվեց" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Սերվերի սխալ" })
    }
})

app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(500).json({ success: false, message: "Սերվերի սխալ" });
        if (!user) return res.status(401).json({ success: false, message: info.message });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ success: false, message: "Մուքտի սխալ" });

            return res.json({
                success: true,
                message: "Բարի գալուստ",
                user: { name: user.name, email: user.email }
            })
        })
    })(req, res, next)
})

app.post("/api/logout", (req, res) => {
    req.logout(function (err) {
        if (err) return res.status(500).json({ message: "Logout error" });
        res.json({ success: true });
    });
});

app.get("/api/profile", (req, res) => {
    if (req.isAuthenticated()) {

        const currentUser = users.find(u => u.id === req.user.id);

        if (currentUser) {
            return res.json({
                name: currentUser.name,
                email: currentUser.email,
                phoneNumber: currentUser.phoneNumber,
                bookings: currentUser.bookings || []
            });
        }
    }
    res.status(401).json({ message: "Not authenticated" });
});

app.post("/api/book", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Մուտք գործեք" });

    const { type, details, totalPrice, contactInfo } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex !== -1) {
        const newOrder = {
            id: Date.now(),
            type, 
            details, 
            totalPrice,
            contactInfo,
            status: "Հաստատված",
            orderedAt: new Date()
        };

        if (!users[userIndex].bookings) users[userIndex].bookings = [];
        users[userIndex].bookings.push(newOrder);

        return res.json({ success: true, message: "Պատվերը գրանցված է" });
    }
    res.status(404).json({ message: "Օգտատերը չի գտնվել" });
});


app.put("/api/user/update", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Մուտք գործած չեք" });

    const { name, phoneNumber } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].phoneNumber = phoneNumber;

        req.user.name = name;
        req.user.phoneNumber = phoneNumber;

        return res.json({ success: true, user: users[userIndex] });
    }
    res.status(404).json({ message: "Օգտատերը չի գտնվել" });
});

app.delete("/api/user/delete", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Մուտք գործած չեք" });

    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        req.logOut(() => {
            res.json({ success: true });
        });
    } else {
        res.status(404).json({ message: "Սխալ" });
    }
});


app.get("/api/houses/:id", (req, res) => {
    const house = houses.find(h => h.id === parseInt(req.params.id));
    if (!house) return res.status(404).json({ message: "Տունը չի գտնվել" });
    res.json(house)
})

app.get("/api/houses", (req, res) => {
    const { search, region, minPrice, maxPrice, people } = req.query;
    let filteredHouses = [...houses];

    if (search) {
        const regex = new RegExp(search.split("").join(".*"), "i");
        filteredHouses = filteredHouses.filter(h => regex.test(h.location));
    }

    if (region) {
        const regionsArray = Array.isArray(region) ? region : [region];
        filteredHouses = filteredHouses.filter(h => regionsArray.includes(h.location));
    }

    if (people) {
        filteredHouses = filteredHouses.filter(h => {
            const capacity = parseInt(h.people.split('-').pop());
            return capacity >= parseInt(people);
        });
    }

    if (minPrice || maxPrice) {
        filteredHouses = filteredHouses.filter(h => {
            const price = parseInt(h.price.replace(/[^0-9]/g, ''));
            const min = minPrice ? parseInt(minPrice) : 0;
            const max = maxPrice ? parseInt(maxPrice) : Infinity;
            return price >= min && price <= max;
        });
    }

    res.json(filteredHouses);
});

app.get("/api/services", (req, res) => res.json(servicesData));


app.get("/api/sales", (req, res) => {
    res.json({
        discounts: discounts,
        prices: prices,
        salesHouses: salesHouses
    }
    )
})

app.get("/api/about", (req, res) => {
    res.json(sectionData);
});

app.listen(process.env.PORT)