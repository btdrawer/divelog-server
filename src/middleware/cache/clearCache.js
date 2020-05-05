const { redisClient } = require("@btdrawer/divelog-server-utils");
const { getUserId } = require("../../utils/authUtils");

module.exports = async (req, res, next) => {
    await next();
    redisClient.del(getUserId(req));
};
