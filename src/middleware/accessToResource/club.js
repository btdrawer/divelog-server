const ClubModel = require('../../models/club');
const errorKeys = require('../../variables/errorKeys');

module.exports = async (req, data) => {
    if (req.method !== 'POST') {
        const club = await ClubModel.findOne({
            _id: req.params.id
        });
    
        if (!club) throw new Error(errorKeys.NOT_FOUND);
        else if (req.method === 'PUT' || req.method === 'DELETE') {
            if (!club.managers.contains(data._id.toString())) {
                throw new Error(errorKeys.FORBIDDEN);
            }
        }
    }
}