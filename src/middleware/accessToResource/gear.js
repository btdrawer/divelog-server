const GearModel = require('../../models/Gear');
const errorKeys = require('../../variables/errorKeys');

module.exports = async (req, next, data) => {
    if (req.method === 'PUT' || req.method === 'DELETE') {
        const gear = await GearModel.findOne({
            _id: req.params.id
        });
    
        if (!gear) throw new Error(errorKeys.NOT_FOUND);
        if (gear.owner !== data._id) throw new Error(errorKeys.FORBIDDEN);
    }

    next();
}