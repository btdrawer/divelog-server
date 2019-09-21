const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const handleError = require('../handlers/handleError');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);

    try {
        const user = await UserModel.findOne({
            _id: data._id,
            token: token
        });

        if (!user) throw new Error('Authentication failed.');

        next();
    } catch (err) {
        handleError(res, err);
    }
};