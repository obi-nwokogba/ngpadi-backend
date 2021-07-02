///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 4000
const { PORT = 4000 } = process.env;
// import express
const express = require("express");
// create application object
const app = express();

///////////////////////////////
// ROUTES
////////////////////////////////

app.get("/", (req, res) => {
    res.send("Welcome to NGpadi");
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`Express Server listening on PORT ${PORT}`));