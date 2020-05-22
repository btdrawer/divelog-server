const { GroupModel } = require("@btdrawer/divelog-server-utils").models;
const { NOT_FOUND, FORBIDDEN } = require("../../../constants/errorCodes");

module.exports = async (req, data) => {
    if (req.params.id) {
        const group = await GroupModel.findOne({
            _id: req.params.id
        });

        if (!group) {
            throw new Error(JSON.stringify(NOT_FOUND));
        } else if (!group.participants.includes(data._id.toString())) {
            throw new Error(JSON.stringify(FORBIDDEN));
        }
    }
};
