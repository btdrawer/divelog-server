const handleSuccess = require("./handlers/handleSuccess");
const handleError = require("./handlers/handleError");

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

exports.generic = async (model, func, res, method, ...args) => {
  try {
    const obj = await model[func](...args);

    handleSuccess(res, obj, method);
  } catch (err) {
    handleError(res, err);
  }
};

exports.post = async ({ model, res, payload }) => {
  try {
    const obj = new model(payload);
    await obj.save();

    handleSuccess(res, obj, "POST");
  } catch (err) {
    handleError(res, err);
  }
};

exports.getAll = async ({ model, req, res, filter, allowedFields }) => {
  try {
    const fields = getFieldsToReturn(req.query.fields, allowedFields);

    const { limit, skip } = req.query;
    const options = {
      limit: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : undefined
    };

    const data = await model.find(filter, fields, options);

    handleSuccess(res, data, "GET");
  } catch (err) {
    handleError(res, err);
  }
};

exports.getOne = async ({ model, req, res, filter, allowedFields }) => {
  try {
    const fields = getFieldsToReturn(req.query.fields, allowedFields);

    const data = await model.findOne(filter, fields);

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
    const obj = await model.findOneAndUpdate(filter, payload, { new: true });

    handleSuccess(res, obj, "PUT");
  } catch (err) {
    handleError(res, err);
  }
};

exports.delete = async ({ model, res, filter }) => {
  try {
    const obj = await model.findOneAndDelete(filter);

    handleSuccess(res, obj, "DELETE");
  } catch (err) {
    handleError(res, err);
  }
};
