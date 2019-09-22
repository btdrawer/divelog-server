const GroupModel = require('../../models/group');
const errorKeys = require('../../variables/errorKeys');

module.exports = async (req, data) => {
    if (req.method !== 'POST' && req.params.id) {
        const group = await GroupModel.findOne({
            _id: req.params.id
        });
    
        if (!group) throw new Error(errorKeys.NOT_FOUND);
        else if (!group.participants.contains(data._id.toString())) {
            throw new Error(errorKeys.FORBIDDEN);
        }
    }
}