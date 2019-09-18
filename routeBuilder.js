const handleSuccess = require('../handleSuccess');
const handleError = require('../handleError');

module.exports = async (func, res) => {
    try {
        handleSuccess(res, func);
    } catch (err) {
        handleError(res, err);
    }
};