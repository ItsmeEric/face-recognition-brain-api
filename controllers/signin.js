const handleSignin = (postgresDB, bcrypt) => (req, res) => {
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
};

module.exports = {
  handleSignin: handleSignin,
};
