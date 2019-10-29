const errorKeys = require('../variables/errorKeys');

module.exports = req => {
    if (req.method === 'POST') {
        if (!req.body.name || !req.body.location) {
            throw new Error(errorKeys.CLUB_DETAILS_MISSING);
        }
    }
}