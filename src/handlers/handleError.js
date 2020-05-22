module.exports = (res, err) => {
    let code = err.code || 500;
    let message = err.message || "An error occurred.";

    if (err.name === "ValidationError") {
        // Validation errors from MongoDB
        code = 400;
        message = `Missing required fields: ${Object.keys(err.errors).join(
            ", "
        )}`;
    } else if (err.name === "CastError") {
        code = 400;
        message = `The following parameter is in an incorrect format: ${err.path}`;
    }

    console.log({
        error: {
            code,
            message
        }
    });

    res.status(code).send(message);
};
