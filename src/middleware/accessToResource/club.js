const ClubModel = require('../../models/club');
const errorKeys = require('../../variables/errorKeys');

module.exports = async (req, data) => {
    if (req.method !== 'POST' || req.params.id || req.params.groupId) {
        const club = await ClubModel.findOne({
            _id: req.params.id
        });
        console.log(club);
    
        if (!club) throw new Error(errorKeys.NOT_FOUND);
        else if (req.method === 'PUT' || req.method === 'DELETE') {
            if (!club.managers.includes(data._id.toString())) {
                throw new Error(errorKeys.FORBIDDEN);
            }
        }
    }
}