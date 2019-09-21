const errorKeys = require('../../variables/errorKeys');
const handleError = require('../../handlers/handleError');

module.exports = async (req, res, next, data) => {
    try {
        if (
            (req.method === 'PUT' || req.method === 'DELETE') &&
            req.params.id !== data._id
        ) {
            throw new Error(errorKeys.FORBIDDEN);
        }
    } catch (err) {
        handleError(res, err);
    }

    next();
}