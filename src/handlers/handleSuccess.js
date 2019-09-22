const errorKeys = require('../variables/errorKeys');
const handleError = require('./handleError');

module.exports = (res, data, method) => {
    try {
        if (method === 'GET') {
            if (!data) throw new Error(errorKeys.NOT_FOUND);
            else if (data.length === 0) throw new Error(errorKeys.NOT_FOUND);
        }

        res.status(200).send(data);
    } catch (err) {
        handleError(res, err);
    }
}