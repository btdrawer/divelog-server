const ClubModel = require("../../../models/ClubModel");
const { NOT_FOUND, FORBIDDEN } = require("../../../constants/errorKeys");

module.exports = async (req, data) => {
    if (req.method !== "POST" && req.params.id) {
        const club = await ClubModel.findOne({
            _id: req.params.id
        });

        if (!club) {
            throw new Error(NOT_FOUND);
        } else if (req.method === "PUT" || req.method === "DELETE") {
            const userId = data._id.toString();
            if (
                !club.managers.includes(userId) &&
                req.url !== `/${req.params.id}/member`
            ) {
                throw new Error(FORBIDDEN);
            }
        }
    }
};
