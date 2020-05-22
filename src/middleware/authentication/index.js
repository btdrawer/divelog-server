const { UserModel } = require("@btdrawer/divelog-server-utils").models;
const routerUrls = require("../../constants/routerUrls");
const { getAuthData } = require("../../utils/authUtils");

// Error handling
const handleError = require("../../handlers/handleError");
const { INVALID_AUTH } = require("../../constants/errorCodes");

// Authentication files for individual resources
const diveAuthentication = require("./resourceAccess/diveAuthentication");
const clubAuthentication = require("./resourceAccess/clubAuthentication");
const gearAuthentication = require("./resourceAccess/gearAuthentication");
const groupAuthentication = require("./resourceAccess/groupAuthentication");

module.exports = async (req, res, next) => {
    try {
        const data = getAuthData(req);

        const user = await UserModel.findOne({
            _id: data._id
        });

        if (!user) throw new Error(INVALID_AUTH);

        // Additional Authentication for individual resources
        switch (req.baseUrl) {
            case routerUrls.DIVE:
                await diveAuthentication(req, data);
                break;
            case routerUrls.CLUB:
                await clubAuthentication(req, data);
                break;
            case routerUrls.GEAR:
                await gearAuthentication(req, data);
                break;
            case routerUrls.GROUP:
                await groupAuthentication(req, data);
                break;
            default:
                break;
        }

        next();
    } catch (err) {
        handleError(res, JSON.parse(err.message));
    }
};
