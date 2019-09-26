const jwt = require('jsonwebtoken');

module.exports = id => jwt.sign({_id: id}, process.env.JWT_KEY);