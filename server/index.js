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
    saveUninitialized: false
}));
app.use(passport.session());
app.use(passport.initialize());

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
            password: hashedPassword
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

app.post("/api/logout", (req, res) => {
    req.logout(function(err) {
        if (err) return res.status(500).json({ message: "Logout error" });
        res.json({ success: true });
    });
});

app.get("/api/profile", (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({
            name: req.user.name,
            email: req.user.email
        });
    }
    res.status(401).json({ message: "Not authenticated" });
});



app.get("/api/houses", (req, res) => {
    res.json(houses);
});

app.get("/api/services", (req, res) => {
    res.json(servicesData);
});

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