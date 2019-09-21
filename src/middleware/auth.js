const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const handleError = require('../handlers/handleError');
const routerUrls = require('../variables/routerUrls');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);

    try {
        switch(req.baseUrl) {
            case routerUrls.USER:
                require('./accessToResource/user')(req, res, next, data);
                break;
        }

        const user = await UserModel.findOne({
            _id: data._id,
            token: token
        });

        if (!user) throw new Error(401);

        next();
    } catch (err) {
        handleError(res, err);
    }
};