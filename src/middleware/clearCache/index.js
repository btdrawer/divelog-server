const { getUserId } = require("../../utils/authUtils");

module.exports = cacheUtils => async (req, res, next) => {
    await next();
    cacheUtils.clearCache(getUserId(req));
};
