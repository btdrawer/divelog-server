const redisClient = require("../../services/redisClient");
const { getUserId } = require("../../utils/authUtils");

module.exports = async (req, res, next) => {
    await next();
    redisClient.del(getUserId(req));
};
