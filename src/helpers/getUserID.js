const getAuthData = require('../middleware/getAuthData');

module.exports = req => getAuthData(req).data._id;