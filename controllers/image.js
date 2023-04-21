//Credentials to clarifai api key access
const clarifai = require("clarifai");

const handleApiCall = (req, res) => {};

const handleImagePut = (req, res, postgresDB) => {
  const { id } = req.body;
  postgresDB("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("Unable to get entries"));
};

module.exports = {
  handleImagePut,
  handleApiCall,
};
