///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 4000
// pull MONGODB_URL from .env
const { PORT = 4000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to MongoDB"))
    .on("close", () => console.log("You are disconnected from MongoDB"))
    .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const UserSchema = new mongoose.Schema({
    displayname: String,
    email: String,
    location: String,
    status: String,
    profilepicurl: String,
    timejoined: String
});

const User = mongoose.model("User", UserSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////


const seedData = require('./seedData.js');
app.get('/seed', (req, res) => {
    User.deleteMany({}, (error, allUsers) => {})
    User.create(seedData, (error, data) => {
        //res.redirect('/users')
        res.send("Seeding Successful! Users added to Mongo DB!")
    });
});


// create a test route
app.get("/", (req, res) => {
    res.send("hello world");
});

// PEOPLE INDEX ROUTE
app.get("/user", async (req, res) => {
    try {
        // send all people
        res.json(await User.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// PEOPLE CREATE ROUTE
app.post("/user", async (req, res) => {
    try {
        // send all people
        res.json(await User.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));