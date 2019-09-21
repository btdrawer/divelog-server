const handleSuccess = require('../handlers/handleSuccess');
const handleError = require('../handlers/handleError');

module.exports = async (func, res) => {
    try {
        handleSuccess(res, func);
    } catch (err) {
        handleError(res, err);
    }
};