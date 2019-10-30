const errorCodes = require("../variables/errorCodes");

module.exports = (res, err) => {
  if (errorCodes[err.message]) {
    const { code, message } = errorCodes[err.message];

    console.log("Error code:", code);
    console.log("Error message:", message);

    res.status(code || 500).send(message);
  } else {
    // Validation errors from MongoDB
    if (err.name === "ValidationError") {
      res
        .status(400)
        .send(`Missing required fields: ${Object.keys(err.errors).join(", ")}`);
    }

    res.status(500).send(err["_message"]);
  }
};
