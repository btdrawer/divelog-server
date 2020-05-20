const { launchServices } = require("@btdrawer/divelog-server-utils");

exports.globalSetup = async () => {
    const { cacheFunctions, closeServices } = await launchServices();

    global.cacheFunctions = cacheFunctions;
    global.closeServices = closeServices;

    return undefined;
};

exports.globalTeardown = async () => {
    await global.closeServices();
};
