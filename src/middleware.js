const UserModel = require('./models/User');
const getAuthData = require('./authentication/helpers/getAuthData');
const routerUrls = require('./variables/routerUrls');
const errorKeys = require('./variables/errorKeys');
const handleError = require('./handlers/handleError');

module.exports = async (req, res, next) => {
    const {token, data} = getAuthData(req);

    try {
        const user = await UserModel.findOne({
            _id: data._id,
            token: token
        });

        if (!user) throw new Error(errorKeys.INVALID_AUTH);

        switch(req.baseUrl) {
            case routerUrls.DIVE:
                await require('./authentication/accessToResource/dive')(req, data);
                break;
            case routerUrls.CLUB:
                await require('./validation/club')(req);
                await require('./authentication/accessToResource/club')(req, data);
                break;
            case routerUrls.GEAR:
                await require('./authentication/accessToResource/gear')(req, data);
                break;
            case routerUrls.GROUP:
                await require('./authentication/accessToResource/group')(req, data);
                break;
            default:
                break;
        }

        next();
    } catch (err) {
        handleError(res, err);
    }
};