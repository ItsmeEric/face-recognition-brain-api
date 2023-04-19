// Import relevant packages
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
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

// A database to check if the user exists or has an account
const database = {
  users: [
    {
      id: "134",
      name: "John",
      email: `john@example.com`,
      password: "cookies",
      entries: 0, // --> To check how many times has the user submitted an image to be detected
      joined: new Date(), // --> Provides the date of when the user joined
    },
    {
      id: "444",
      name: "Andrei",
      email: `andreiscott@example.com`,
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@example.com",
    },
  ],
};

//Create a route to make sure everything is running properly at the root route "('/')"
app.get("/", (req, res) => {
  res.send(database.users);
});

//Implementing a signing route and use JSON instead of .send();
app.post("/signin", (req, res) => {
  //Check is entered user exists
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(404).json("Error logging in");
  }
});

//Create register to register new users
app.post("/register", (req, res) => {
  //Get what we need from the body using destructuring
  const { email, name, password } = req.body;
  // Insert new user into the DB when registered
  postgresDB("users")
    .returning("*")
    .insert({
      name: name,
      email: email,
      joined: new Date(),
    })
    .then((user) => {
      // Respond with the newly created user
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("Unable to Register"));
});

//Getting the user by using id
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  postgresDB
    .select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not Found");
      }
    })
    .catch((err) => {
      res.status(400).json("Error getting user");
    });
});

//Increasing users entries
app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) return res.status(404).json("No such user");
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
