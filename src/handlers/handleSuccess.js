const checkNotFound = require('./checkNotFound');
const handleError = require('./handleError');

module.exports = async (res, data, method) => {
    try {
        await checkNotFound(data, method);

        res.status(200).send(data);
    } catch (err) {
        handleError(res, err);
    }
}