const handleSuccess = require("./handlers/handleSuccess");
const handleError = require("./handlers/handleError");
const { INVALID_SORT_VALUE } = require("./constants/errorKeys");

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

exports.generic = async (model, func, res, method, ...args) => {
    try {
        const obj = await model[func](...args);

        handleSuccess(res, obj, method);
    } catch (err) {
        handleError(res, err);
    }
};

exports.post = async ({ model, res, payload, additionalRequests }) => {
    try {
        const obj = new model(payload);
        await obj.save();

        if (additionalRequests) {
            additionalRequests.forEach(
                async ({ model, ref, id }) =>
                    await model.findOneAndUpdate(
                        {
                            _id: id
                        },
                        {
                            $push: {
                                [ref]: obj.id
                            }
                        }
                    )
            );
        }

        handleSuccess(res, obj, "POST");
    } catch (err) {
        handleError(res, err);
    }
};

exports.getAll = async ({ model, req, res, filter, allowedFields }) => {
    try {
        const fields = getFieldsToReturn(req.query.fields, allowedFields);

        const { limit, skip, sort_by, sort_order } = req.query;
        if (
            typeof sort_by === "string" &&
            allowedFields &&
            !allowedFields.includes(sort_by)
        ) {
            throw new Error(INVALID_SORT_VALUE);
        }
        const options = {
            limit: limit ? parseInt(limit) : undefined,
            skip: skip ? parseInt(skip) : undefined,
            sort: {
                [sort_by]: sort_order === "DESC" ? -1 : 1
            }
        };

        const data = await model.find(filter, fields, options);

        handleSuccess(res, data, "GET");
    } catch (err) {
        handleError(res, err);
    }
};

exports.getOne = async ({
    model,
    req,
    res,
    filter,
    allowedFields,
    fieldsToPopulate
}) => {
    try {
        const fields = getFieldsToReturn(req.query.fields, allowedFields);
        const data = await model.findOne(filter, fields);
        if (fieldsToPopulate) {
            await populateFields(data, fieldsToPopulate);
        }
        handleSuccess(res, data, "GET");
    } catch (err) {
        handleError(res, err);
    }
};

exports.put = async ({ model, res, filter, payload }) => {
    for (let prop in payload) {
        if (!payload[prop]) delete payload[prop];
    }

    try {
        const obj = await model.findOneAndUpdate(filter, payload, {
            new: true
        });
        handleSuccess(res, obj, "PUT");
    } catch (err) {
        handleError(res, err);
    }
};

exports.delete = async ({ model, res, filter, additionalRequests }) => {
    try {
        const obj = await model.findOneAndDelete(filter);

        if (additionalRequests) {
            additionalRequests.forEach(
                async ({ model, ref, id }) =>
                    await model.findOneAndUpdate(
                        {
                            _id: id
                        },
                        {
                            $pull: {
                                [ref]: obj.id
                            }
                        }
                    )
            );
        }

        handleSuccess(res, obj, "DELETE");
    } catch (err) {
        handleError(res, err);
    }
};
