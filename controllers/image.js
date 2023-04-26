const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

// const USER_ID = "itsmeeric";
// const APP_ID = "my-first-application";
const MODEL_ID = "face-detection";
const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key" + " " + process.env.API_CLARIFAI_KEY);

// Predict concept in an image
const handleApiCallPost = (req, res) => {
  stub.PostModelOutputs(
    {
      model_id: MODEL_ID,
      inputs: [{ data: { image: { url: req.body.input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }

      if (response.status.code !== 10000) {
        console.log(
          "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details
        );
        return;
      }

      console.log("Predicted concepts, with confidence values:");
      for (const c of response.outputs[0].data.concepts) {
        console.log(c.name + ": " + c.value);
      }
      res.json(response);
    }
  );
};

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
  handleApiCallPost,
};
