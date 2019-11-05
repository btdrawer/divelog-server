module.exports = id =>
  require("jsonwebtoken").sign({ _id: id }, process.env.JWT_KEY);
