const handleSuccess = require('../handlers/handleSuccess');
const handleError = require('../handlers/handleError');

module.exports = async (func, res, method) => {
    try {
        handleSuccess(res, func, method);
    } catch (err) {
        handleError(res, err);
    }
};