const getAuthData = require('./getAuthData');

module.exports = req => getAuthData(req).data._id;