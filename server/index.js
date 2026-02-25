import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import bcrypt from "bcryptjs";
import { houses, salesHouses, discounts, servicesData, sectionData, prices } from "./data.js";


dotenv.config();


let app = express();
app.use(cors());
app.use(express.json());

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