const { getUserId } = require("../../utils/authUtils");

module.exports = async (req, res, next) => {
    await next();
    global.cacheFunctions.clearCache(getUserId(req));
};
