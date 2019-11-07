const errorCodes = require("../variables/errorCodes");

module.exports = (res, err) => {
  if (errorCodes[err.message]) {
    const { code, message } = errorCodes[err.message];

    console.log({
      error: {
        code,
        message
      }
    });

    res.status(code || 500).send(message);
  } else if (err.name === "ValidationError") {
    // Validation errors from MongoDB
    let code = 400;
    let message = `Missing required fields: ${Object.keys(err.errors).join(
      ", "
    )}`;

    console.log({
      error: {
        code,
        message
      }
    });

    res.status(code).send(message);
  }
};
