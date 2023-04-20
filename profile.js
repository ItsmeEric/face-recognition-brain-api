const handleProfileGet = (req, res, postgresDB) => {
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
};

// For the ES6 we actually don't need the value, so we export it this way
module.exports = {
  handleProfileGet,
};
