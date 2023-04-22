const handleRegister = (req, res, postgresDB, bcrypt) => {
  //Get what we need from the body using destructuring
  const { email, name, password } = req.body;

  // Form Validation
  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission");
  }

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
        .then(trx.commit) // Make sure it's committed
        .catch(trx.rollback);
    })
    .catch((err) => res.status(400).json("Unable to Register"));
};

module.exports = {
  handleRegister: handleRegister,
};
