const { Services } = require("@btdrawer/divelog-server-utils");

exports.globalSetup = async () => {
    global.services = await Services.launchServices();
    return undefined;
};

exports.globalTeardown = async () => {
    await global.services.closeServices();
};
