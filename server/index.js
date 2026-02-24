import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import bcrypt from "bcryptjs";
import { houses,discounts, servicesData, sectionData, prices} from "./data.js";


dotenv.config();


let app = express();
app.use(cors());
app.use(express.json());

app.get("/api/houses", (req, res) => {
    res.json(houses);
});

app.get("/api/discounts", (req, res) => {
    res.json(discounts);
});

app.get("/api/services", (req, res) => {
    res.json(servicesData);
});

app.get("/api/about", (req, res) => {
    res.json(sectionData);
});

app.get("/api/prices", (req, res) => {
    res.json(prices);
});


app.listen(process.env.PORT)