const { connect } = require("@btdrawer/divelog-server-utils");

exports.globalSetup = async () => {
    const { db, redisClient } = await connect();

    global.db = db;
    global.redisClient = redisClient;

    return undefined;
};

exports.globalTeardown = async () => {
    await global.db.close();
};
