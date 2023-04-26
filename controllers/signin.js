const handleSignin = (req, res, postgresDB, bcrypt) => {
  const { email, password } = req.body;

  // Form Validation
  if (!email || !password) {
    return res.status(400).json("Incorrect form submission");
  }
  //Check if entered user exists credentials match the existing ones
  postgresDB
    .select("email", "hash")
    .from("login")
    .where("email", "=", email) // Compare emails
    .then((data) => {
      // compare the hashes
      const isValidPassword = bcrypt.compareSync(password, data[0].hash);

      if (isValidPassword) {
        return postgresDB
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to find user"));
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("Wrong credentials"));
};

module.exports = {
  handleSignin: handleSignin,
};
