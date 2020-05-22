const { GearModel } = require("@btdrawer/divelog-server-utils").models;
const { NOT_FOUND, FORBIDDEN } = require("../../../constants/errorCodes");

module.exports = async (req, data) => {
    if (req.method !== "POST" && req.params.id) {
        const gear = await GearModel.findOne({
            _id: req.params.id
        });

        if (!gear) {
            throw new Error(JSON.stringify(NOT_FOUND));
        } else if (gear.owner.toString() !== data._id.toString()) {
            throw new Error(JSON.stringify(FORBIDDEN));
        }
    }
};
