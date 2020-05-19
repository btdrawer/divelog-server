const {
    convertStringToBase64,
    convertBase64ToString
} = require("./base64Utils");
const { getUserId } = require("./authUtils");

const generateCursor = ({ sortBy, sortOrder, value }) =>
    convertStringToBase64(
        JSON.stringify({
            sortBy,
            sortOrder,
            value
        })
    );

const parseCursor = cursor => JSON.parse(convertBase64ToString(cursor));

const generateQueryFromCursor = ({ sortBy, sortOrder, value }) => {
    const cursorDirection = sortOrder === "DESC" ? "$lt" : "$gt";
    return {
        [sortBy]: {
            [cursorDirection]: value
        }
    };
};

const formatLimit = limit => parseInt(limit) + 1;

const formatQueryOptions = ({ sortBy, sortOrder, limit }) => ({
    sort: {
        [sortBy]: sortOrder === "DESC" ? -1 : 1
    },
    limit: formatLimit(limit)
});

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

const queryWithCache = async ({
    useCache,
    userId,
    queryProps: { model, filter, fields, options }
}) => {
    const result = useCache
        ? await model.find(filter, fields, options).cache({
              hashKey: userId
          })
        : await model.find(filter, fields, options);
    return result;
};

module.exports = ({
    model,
    filter,
    allowedFields,
    useCache = false
}) => async req => {
    const { query } = req;
    const { limit = 10, cursor } = query;
    const fields = getFieldsToReturn(req.query.fields, allowedFields);
    const userId = getUserId(req);
    let { sortBy = "_id", sortOrder = "ASC" } = query;
    let result;
    if (cursor) {
        const parsedCursor = parseCursor(cursor);
        sortBy = parsedCursor.sortBy;
        sortOrder = parsedCursor.sortOrder;
        result = await queryWithCache({
            useCache,
            userId,
            queryProps: {
                model,
                filter: generateQueryFromCursor(parsedCursor),
                fields,
                options: {
                    limit: formatLimit(limit)
                }
            }
        });
    } else {
        result = await queryWithCache({
            useCache,
            userId,
            queryProps: {
                model,
                filter,
                fields,
                options: formatQueryOptions({ sortBy, sortOrder, limit })
            }
        });
    }
    const hasNextPage = result.length > limit;
    result = hasNextPage ? result.slice(0, limit) : result;
    return {
        data: result,
        pageInfo: {
            hasNextPage,
            cursor: hasNextPage
                ? generateCursor({
                      sortBy,
                      sortOrder,
                      value: result[result.length - 1][sortBy]
                  })
                : null
        }
    };
};
