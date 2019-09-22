const errorKeys = require('../variables/errorKeys');

const handleRead = (data) => {
    if (data.length === 0) throw new Error(errorKeys.NOT_FOUND);
};

const handlePut = (data) => {
    if (data.nModified === 0) throw new Error(errorKeys.NOT_FOUND);
};

const handleDelete = (data) => {
    if (data.deletedCount === 0) throw new Error(errorKeys.NOT_FOUND);
};

module.exports = (data, method) => {
    switch (method) {
        case 'GET':
            handleRead(data);
            break;
        case 'PUT':
            handlePut(data);
            break;
        case 'DELETE':
            handleDelete(data);
            break;
        default:
            break;
    }
};