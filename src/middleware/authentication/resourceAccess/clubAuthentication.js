const { ClubModel } = require("@btdrawer/divelog-server-utils").models;
const { NOT_FOUND, FORBIDDEN } = require("../../../constants/errorCodes");

module.exports = async (req, data) => {
    if (req.method !== "POST" && req.params.id) {
        const club = await ClubModel.findOne({
            _id: req.params.id
        });

        if (!club) {
            throw new Error(JSON.stringify(NOT_FOUND));
        } else if (req.method === "PUT" || req.method === "DELETE") {
            const userId = data._id.toString();
            if (
                !club.managers.includes(userId) &&
                req.url !== `/${req.params.id}/member`
            ) {
                throw new Error(JSON.stringify(FORBIDDEN));
            }
        }
    }
};
