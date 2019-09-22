const jwt = require('jsonwebtoken');

module.exports = req => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);

    return {token, data};
};