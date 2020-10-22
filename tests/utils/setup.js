const { Services } = require("@btdrawer/divelog-server-core");

exports.globalSetup = async () => {
    global.services = await Services.launchServices();
    return undefined;
};

exports.globalTeardown = async () => {
    await global.services.closeServices();
    return undefined;
};
