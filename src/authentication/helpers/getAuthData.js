const jwt = require("jsonwebtoken");
const { INVALID_AUTH } = require("../../variables/errorKeys");

module.exports = req => {
  if (!req.header("Authorization")) throw new Error(INVALID_AUTH);

  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);

  return { token, data };
};
