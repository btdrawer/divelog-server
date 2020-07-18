const {
    convertStringToBase64,
    convertBase64ToString
} = require("./base64Utils");
const { getUserId } = require("./authUtils");
const { getFieldsToReturn } = require("./routeUtils");

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

module.exports = ({
    model,
    filter,
    allowedFields,
    hashKey,
    cacheUtils
}) => async req => {
    const { query } = req;
    const { limit = 10, cursor } = query;
    let { sortBy = "_id", sortOrder = "ASC" } = query;

    const fields = getFieldsToReturn(req.query.fields, allowedFields);

    let result;
    if (cursor) {
        const parsedCursor = parseCursor(cursor);
        sortBy = parsedCursor.sortBy;
        sortOrder = parsedCursor.sortOrder;
        result = await cacheUtils.queryWithCache(hashKey, {
            model,
            filter: generateQueryFromCursor(parsedCursor),
            fields,
            options: {
                limit: formatLimit(limit)
            }
        });
    } else {
        result = await cacheUtils.queryWithCache(hashKey, {
            model,
            filter,
            fields,
            options: formatQueryOptions({ sortBy, sortOrder, limit })
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
