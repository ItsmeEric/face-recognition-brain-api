// Import relevant packages
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

// Import controllers
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
//Create our app by running express
const app = express();

//Use a middleware to parse our body code into JSON
app.use(express.json());

// Use middleware to display backend data
app.use(cors());

// Using Knex
const postgresDB = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "smart-brain",
  },
});

//Create a route to make sure everything is running properly at the root route "('/')"
app.get("/", (req, res) => {
  res.send("Everything is running totally fine");
});

// Checking if our user exists and if so let him sign in
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, postgresDB, bcrypt);
});

//Create register to register new users
app.post("/register", (req, res) => {
  register.handleRegister(req, res, postgresDB, bcrypt);
});

//Getting the user by using id
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, postgresDB);
});

// Incrementing users entries
app.put("/image", (req, res) => {
  image.handleImagePut(req, res);
});

//Give our app a port to run in
app.listen(3000, () => {
  console.log("App is running on port 3000");
});

/*
1. Have an idea of how my API design will look like before starting my app
/ --> res = this is working
/signing --> POST = success/fail
/register --> POST = newUser
/profile/:userId --> GET = newUser
/image --> PUT --> updatedUser
*/
