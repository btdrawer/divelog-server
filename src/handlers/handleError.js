const errorCodes = require("../variables/errorCodes");

module.exports = (res, err) => {
  if (errorCodes[err.message]) {
    const { code, message } = errorCodes[err.message];

    console.log("Error code:", code);
    console.log("Error message:", message);

    res.status(code || 500).send(message);
  } else if (err.name === "ValidationError") {
    // Validation errors from MongoDB
    res
      .status(400)
      .send(`Missing required fields: ${Object.keys(err.errors).join(", ")}`);
  }
};
