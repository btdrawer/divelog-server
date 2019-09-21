const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);

    try {
        const user = await UserModel.findOne({
            _id: data._id,
            'tokens.token': token
        });

        if (!user) throw new Error('Authentication failed.');

        next();
    } catch (e) {
        res.status(400).send(e);
    }
};