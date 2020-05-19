const { connect } = require("@btdrawer/divelog-server-utils");

exports.globalSetup = async () => {
    const { mongoose, queryWithCache, clearCache } = await connect();

    global.mongoose = mongoose;
    global.queryWithCache = queryWithCache;
    global.clearCache = clearCache;

    return undefined;
};

exports.globalTeardown = async () => {
    await global.mongoose.close();
};
