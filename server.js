// Import relevant packages
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
//Create our app by running express
const app = express();

//Use a middleware to parse our body code into JSON
app.use(express.json());

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

// Use middleware to display backend data
app.use(cors());

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
  // bcrypt for handling passwords
  bcrypt.hash(password, null, null, function (err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });
  database.users.push({
    id: "555",
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  // Give a response/return to postman: In our case the newly created USER
  res.json(database.users[database.users.length - 1]);
});

//Getting the user by using id
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) return res.status(404).json("No such user");
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
