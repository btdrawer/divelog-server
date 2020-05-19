const handleSuccess = require("../handlers/handleSuccess");
const handleError = require("../handlers/handleError");

const reduceFields = fields =>
    fields.reduce(
        (acc, field) => ({
            ...acc,
            [field]: 1
        }),
        {}
    );

const getFieldsToReturn = (requestedFields, allowedFields) => {
    if (allowedFields) {
        return reduceFields(allowedFields);
    }
    if (typeof requestedFields === "string") {
        return reduceFields(requestedFields.split(","));
    }
    return null;
};

const filterPayload = payload =>
    Object.keys(payload).reduce((acc, key) => {
        const value = payload[key];
        if (value !== null && value !== undefined) {
            return {
                ...acc,
                [key]: value
            };
        }
        return acc;
    }, {});

const populateFields = async (func, fields) => {
    const data = await func.apply();
    await fields.reduce(
        (p, field) => p.then(() => data.populate(field).execPopulate()),
        Promise.resolve()
    );
    return data;
};

const useHandlers = func => async (req, res) => {
    try {
        const result = await func(req, res);
        handleSuccess(res, result, req.method);
    } catch (err) {
        handleError(res, err);
    }
};

module.exports = {
    getFieldsToReturn,
    filterPayload,
    populateFields,
    useHandlers
};
