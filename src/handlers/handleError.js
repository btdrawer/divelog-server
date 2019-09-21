const errorCodes = require('../variables/errorCodes');

module.exports = (res, err) => {
    const {code, message} = errorCodes[err.message];

    console.log('Error code:', code);
    console.log('Error message:', message);
    
    res.status(code || 500).send(message);
};