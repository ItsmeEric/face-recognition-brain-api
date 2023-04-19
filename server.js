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

//Create a route to make sure everything is running properly at the root route "('/')"
app.get("/", (req, res) => {
  res.send(database.users);
});

// Checking if our user exists and if so let him sign in
app.post("/signin", (req, res) => {
  //Check if entered user exists credentials match the existing ones
  postgresDB
    .select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email) // Compare emails
    .then((data) => {
      // compare the hashes
      const isValidPassword = bcrypt.compareSync(
        req.body.password,
        data[0].hash
      );

      if (isValidPassword) {
        return postgresDB
          .select("*")
          .from("users")
          .where("email", "=", req.body.email) // Compare user login email with DB existing emails
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to find user"));
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("Wrong credentials")); // If everything fails
});

//Create register to register new users
app.post("/register", (req, res) => {
  //Get what we need from the body using destructuring
  const { email, name, password } = req.body;

  // Hash user password
  const hash = bcrypt.hashSync(password);

  // Transactions
  postgresDB
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into("login")
        .returning("email") // Returns added email
        .then((loginEmail) => {
          // Insert new user into the DB when registered
          // And return the info as part of the transaction
          return trx("users")
            .returning("*")
            .insert({
              name: name,
              email: loginEmail[0].email,
              joined: new Date(),
            })
            .then((user) => {
              // Respond with the newly created user
              res.json(user[0]);
            });
        })
        .them(trx.commit) // Make sure it's committed
        .then(trx.rollback);
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

// Incrementing users entries
app.put("/image", (req, res) => {
  const { id } = req.body;
  postgresDB("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("Unable to get entries"));
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
