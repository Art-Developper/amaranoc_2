import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";
import { houses, salesHouses, discounts, servicesData, sectionData, prices } from "./data.js";

dotenv.config();

let app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://192.168.0.46:3000"
        ],
        credentials: true
    }
});

const userSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    bookings: { type: Array, default: [] }
});
const User = mongoose.model("User", userSchema);


io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return;
        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    // Զանգերի սիգնալիզացիա (WebRTC-ի համար)
    socket.on("call-user", (data) => {
        io.to(data.userToCall).emit("incoming-call", {
            from: data.from,
            name: data.name,
            signal: data.signalData,
            type: data.type // 'audio' կամ 'video'
        });
    });

    socket.on("answer-call", (data) => {
        io.to(data.to).emit("call-accepted", data.signal);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});


app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://192.168.0.46:3000"    
    ],
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



// Ստանալ կամ ստեղծել չատ (Անհատական)
app.post("/api/chat", async (req, res) => {
    const { userId } = req.body;
    try {
        let chat = await Chat.findOne({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        }).populate("users", "-password").populate("latestMessage");

        if (chat) return res.send(chat);

        const newChat = await Chat.create({
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        });
        const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
        res.json(fullChat);
    } catch (error) { res.status(500).send(error); }
});

app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    // Գտնում ենք բոլորին, բացի ընթացիկ օգտատիրոջից
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password");
    res.send(users);
});

// Ստեղծել խմբային չատ
app.post("/api/chat/group", async (req, res) => {
    const { users, name } = req.body;
    try {
        const groupChat = await Chat.create({
            chatName: name,
            users: [...users, req.user._id],
            isGroupChat: true,
            groupAdmin: req.user._id
        });
        const fullGroup = await Chat.findById(groupChat._id).populate("users", "-password");
        res.json(fullGroup);
    } catch (error) { res.status(500).send(error); }
});

// Ուղարկել հաղորդագրություն (Text / Voice / File)
app.post("/api/message", async (req, res) => {
    const { content, chatId, messageType, fileUrl } = req.body;
    try {
        let newMessage = await Message.create({
            sender: req.user._id,
            content,
            chat: chatId,
            messageType: messageType || "text",
            fileUrl: fileUrl || ""
        });

        // Թարմացնում ենք վերջին հաղորդագրությունը չատում
        await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

        // ԿԱՐԵՎՈՐ։ Populate ենք անում sender-ը և chat-ի users-ը
        newMessage = await Message.findById(newMessage._id)
            .populate("sender", "name email")
            .populate({
                path: "chat",
                populate: { path: "users", select: "name email" }
            });

        res.json(newMessage);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Ջնջել ամբողջ չատի պատմությունը (Ձեր ուզած հնարավորությունը)
app.delete("/api/message/clear/:chatId", async (req, res) => {
    try {
        await Message.deleteMany({ chat: req.params.chatId });
        res.json({ success: true, message: "History cleared" });
    } catch (error) { res.status(500).send(error); }
});



app.post("/api/register", async (req, res) => {
    try {
        const { name, phoneNumber, email, password } = req.body;
        const usrExists = await User.findOne({ email });
        if (usrExists) return res.status(400).json({ success: false, message: "Այս էլ. հասցեն արդեն գրանցված է" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUsr = new User({ name, phoneNumber, email, password: hashedPassword, bookings: [] });
        await newUsr.save();
        res.status(201).json({ success: true, message: "Գրանցումը հաջողվեց" });
    } catch (error) { res.status(500).json({ success: false }); }
});

app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (!user) return res.status(401).json({ success: false, message: info.message });
        req.logIn(user, () => res.json({ success: true, user }));
    })(req, res, next);
});

app.get("/api/profile", async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.user.id);
        return res.json(user);
    }
    res.status(401).send("Not authenticated");
});

app.post("/api/book", async (req, res) => {
    const { type, houseId, startDate, endDate, guests, totalPrice, contactInfo, details } = req.body;
    try {
        const user = await User.findById(req.user.id);
        let newBooking = { id: Date.now(), type: type || 'house', totalPrice, contactInfo, bookedAt: new Date() };
        if (type === 'giftcard' || type === 'service') { newBooking.details = details; }
        else {
            const bookedHouse = houses.find(h => h.id === parseInt(houseId));
            newBooking.startDate = startDate; newBooking.endDate = endDate; newBooking.guests = guests;
            newBooking.houseDetails = { location: bookedHouse?.location, image: Array.isArray(bookedHouse?.image) ? bookedHouse.image[0] : bookedHouse?.image };
        }
        user.bookings.push(newBooking);
        await user.save();
        res.json({ success: true });
    } catch (error) { res.status(500).send(error); }
});

app.put("/api/user/update", async (req, res) => {
    const { name, phoneNumber } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, phoneNumber }, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch (error) { res.status(500).send(error); }
});

app.delete("/api/user/delete", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        req.logout(() => res.json({ success: true }));
    } catch (error) { res.status(500).send(error); }
});

app.get("/api/users/all", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
        const allUsers = await User.find({ _id: { $ne: req.user._id } }).select("-password");
        res.json(allUsers);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/api/chat", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Not authenticated");
    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        res.status(200).send(chats);
    } catch (error) {
        res.status(500).send(error);
    }
});

// 3. Ստանալ կոնկրետ չատի հաղորդագրությունների պատմությունը
app.get("/api/message/:chatId", async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


app.get("/api/houses", (req, res) => {
    const { search } = req.query;
    if (search) {
        const regex = new RegExp(search.split("").join(".*"), "i");
        return res.json(houses.filter(h => regex.test(h.location)));
    }
    res.json(houses);
});

app.get("/api/houses/:id", (req, res) => res.json(houses.find(h => h.id == req.params.id)));
app.get("/api/services", (req, res) => res.json(servicesData));
app.get("/api/sales", (req, res) => res.json({ discounts, prices, salesHouses }));
app.get("/api/about", (req, res) => res.json(sectionData));

app.post("/api/logout", (req) => req.logout(() => { }));


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        server.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Server & Socket running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch(err => console.error(err));