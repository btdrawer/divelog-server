const errorKeys = require('../../variables/errorKeys');

module.exports = async (req, next, data) => {
    if (
        (req.method === 'PUT' || req.method === 'DELETE') &&
        req.params.id !== data._id
    ) {
        throw new Error(errorKeys.FORBIDDEN);
    }

    next();
}