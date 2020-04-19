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

const populateFields = async (data, fields) =>
    fields.reduce(
        (p, field) => p.then(() => data.populate(field).execPopulate()),
        Promise.resolve()
    );

module.exports = {
    getFieldsToReturn,
    populateFields
};
