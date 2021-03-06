
// DEPENDENCIES
//====================================
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

//====================================
// DATABASE CONNECTION
//====================================
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

//====================================
// MODELS
//====================================
const UserSchema = new mongoose.Schema({
  displayname: String,
  email: String,
  location: String,
  status: String,
  profilepicurl: String,
  timejoined: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);



const PostSchema = new mongoose.Schema({
  postid: String,
  posttitle: String,
  posttype: String,
  posturl: String,
  posttext: String,
  userid: String
  // timecreated: { type: Date, default: Date.now }
});
const Post = mongoose.model("Post", PostSchema);

//====================================
// MiddleWare
//====================================
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//====================================
// ROUTES
//====================================
// Seed data with first set of users
//====================================
const seedData = require('./seedData.js');

app.get('/seed', (req, res) => {
  User.deleteMany({}, (error, allUsers) => { })
  User.create(seedData, (error, data) => {
    //res.redirect('/users')
    res.send("Seeding Successful! Users added to Mongo DB!")
  });
});

//====================================
// Seed data with first set of users
//====================================
const seedData2 = require('./seedPosts.js');

app.get('/seed2', (req, res) => {
  Post.deleteMany({}, (error, allPosts) => { })
  Post.create(seedData2, (error, data) => {
    res.send("Seeding Successful! Posts added!")
  });
});

//==============================
// Home page route
//==============================
app.get("/", (req, res) => {
  res.send("Welcome to NGpadi!");
});

//==============================
// USER INDEX ROUTE
//==============================
app.get("/user", async (req, res) => {
  try {
    // Return all in User
    res.json(await User.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//==============================
// USER CREATE ROUTE
//==============================
app.post("/user", async (req, res) => {
  try {
    let user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    //send error
    res.send("THERE WAS AN ERROR!");
    //res.status(400).json(error);
  }
});








//==============================
// POST INDEX ROUTE
//==============================
app.get("/post", async (req, res) => {
  try {
    // Return all in Post
    res.json(await Post.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//==============================
// POST CREATE ROUTE
//==============================
app.post("/post", async (req, res) => {
  try {
    let post = await Post.create(req.body);
    res.json(post);
  } catch (error) {
    res.send("THERE WAS AN ERROR!");
  }
});

//==============================
// DELETE ROUTE FOR USERS
//==============================
app.delete("/user/:id", async (req, res) => {
  try {
    // send all people
    res.json(await User.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//==============================
// UPDATE ROUTE FOR USERS
//==============================
app.put("/user/:id", async (req, res) => {
  try {
    // send all people
    res.json(
      await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//==============================
// LISTENER
//==============================
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));