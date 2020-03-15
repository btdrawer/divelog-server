const handleSuccess = require("./handlers/handleSuccess");
const handleError = require("./handlers/handleError");

const getFieldsToReturn = fields => {
  if (typeof fields === "object") {
    return fields.reduce(
      (acc, field) => ({
        ...acc,
        [field]: 1
      }),
      {}
    );
  }

  return undefined;
};

exports.generic = async (model, func, res, method, ...args) => {
  try {
    const obj = await model[func](...args);

    handleSuccess(res, obj, method);
  } catch (err) {
    handleError(res, err);
  }
};

exports.post = async (model, res, payload) => {
  try {
    const obj = new model(payload);
    await obj.save();

    handleSuccess(res, obj, "POST");
  } catch (err) {
    handleError(res, err);
  }
};

exports.getAll = async ({ model, req, res, filter, visibleFields }) => {
  try {
    let fields;
    if (visibleFields) {
      fields = getFieldsToReturn(visibleFields);
    } else if (req.query.fields) {
      fields = getFieldsToReturn(req.query.fields.split(","));
    } else {
      fields = null;
    }

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

exports.getOne = async (model, res, query, fieldsToReturn) => {
  try {
    const obj = fieldsToReturn
      ? await model.findOne(query, fieldsToReturn)
      : await model.findOne(query);

    handleSuccess(res, obj, "GET");
  } catch (err) {
    handleError(res, err);
  }
};

exports.put = async (model, res, query, payload) => {
  for (let prop in payload) {
    if (!payload[prop]) delete payload[prop];
  }

  try {
    const obj = await model.findOneAndUpdate(query, payload, { new: true });

    handleSuccess(res, obj, "PUT");
  } catch (err) {
    handleError(res, err);
  }
};

exports.delete = async (model, res, query) => {
  try {
    const obj = await model.findOneAndDelete(query);

    handleSuccess(res, obj, "DELETE");
  } catch (err) {
    handleError(res, err);
  }
};
