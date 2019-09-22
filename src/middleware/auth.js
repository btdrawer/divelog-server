const UserModel = require('../models/User');
const getAuthData = require('../helpers/getAuthData');
const routerUrls = require('../variables/routerUrls');
const errorKeys = require('../variables/errorKeys');
const handleError = require('../handlers/handleError');

module.exports = async (req, res, next) => {
    const {token, data} = getAuthData(req);

    try {
        const user = await UserModel.findOne({
            _id: data._id,
            token: token
        });

        if (!user) throw new Error(errorKeys.INVALID_AUTH);

        switch(req.baseUrl) {
            case routerUrls.USER:
                await require('./accessToResource/user')(req, next, data);
                break;
            case routerUrls.GEAR:
                await require('./accessToResource/gear')(req, next, data);
                break;
            default:
                break;
        }

        next();
    } catch (err) {
        handleError(res, err);
    }
};