const errorCodes = require("../variables/errorCodes");

module.exports = (res, err) => {
  let code = 500,
    message = "An error occurred.";

  if (errorCodes[err.message]) {
    const errorCode = errorCodes[err.message];

    code = errorCode.code;
    message = errorCode.message;
  } else if (err.name === "ValidationError") {
    // Validation errors from MongoDB
    code = 400;
    message = `Missing required fields: ${Object.keys(err.errors).join(", ")}`;
  } else if (err.name === "CastError") {
    code = 400;
    message = `Cannot write property: ${err.path}`;
  } else {
    console.log(err);
  }

  console.log({
    error: {
      code,
      message
    }
  });

  res.status(code).send(message);
};
