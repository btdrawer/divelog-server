const handleSuccess = require('../handlers/handleSuccess');
const handleError = require('../handlers/handleError');

exports.post = async (model, res, payload) => {
    try {
        const obj = new model(payload);
        await obj.save();

        handleSuccess(res, obj, 'POST');
    } catch (err) {
        handleError(res, err);
    }
};

exports.getAll = async (model, res, fieldsToReturn) => {
    try {
        fieldsToReturn = fieldsToReturn.reduce((fields, field) => {
            fields[field] = 1;
            return fields;
        }, {});

        const obj = fieldsToReturn 
            ? await model.find({}, fieldsToReturn) 
            : await model.find({});

        handleSuccess(res, obj, 'GET');
    } catch (err) {
        handleError(res, err);
    }
};

exports.getOne = async (model, res, query, fieldsToReturn) => {
    try {
        const obj = fieldsToReturn 
            ? await model.findOne(query, fieldsToReturn) 
            : await model.findOne(query);

        handleSuccess(res, obj, 'GET');
    } catch (err) {
        handleError(res, err);
    }
};

exports.put = async (model, res, query, payload) => {
    try {
        const obj = await model.findOneAndUpdate(
            query, payload, {new: true}
        );

        handleSuccess(res, obj, 'PUT');
    } catch (err) {
        handleError(res, err);
    }
};

exports.delete = async (model, res, query) => {
    try {
        const obj = await model.findOneAndDelete(query);

        handleSuccess(res, obj, 'DELETE');
    } catch (err) {
        handleError(res, err);
    }
};