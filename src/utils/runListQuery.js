const {
    convertStringToBase64,
    convertBase64ToString
} = require("./base64Utils");

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

const formatWhere = ({ where, requiredArgs }) => {
    let newWhere = { ...where };
    for (let prop in newWhere) {
        if (!newWhere[prop]) delete newWhere[prop];
    }
    if (newWhere.id) {
        newWhere._id = newWhere.id;
        delete newWhere.id;
    }
    newWhere = {
        ...newWhere,
        ...requiredArgs
    };
    return newWhere;
};

const formatQueryOptions = ({ sortBy, sortOrder, limit }) => ({
    sort: {
        [sortBy]: sortOrder === "DESC" ? -1 : 1
    },
    limit: limit + 1
});

module.exports = async ({ model, req, vfilter, allowedFields }) => {
    const { query } = req;
    const { limit = 10, cursor } = query;
    let { sortBy = "_id", sortOrder = "ASC" } = query;
    let result;
    if (cursor) {
        const parsedCursor = parseCursor(cursor);
        sortBy = parsedCursor.sortBy;
        sortOrder = parsedCursor.sortOrder;
        result = await model.find(
            { ...generateQueryFromCursor(parsedCursor), ...requiredArgs },
            null,
            {
                limit: limit + 1
            }
        );
    } else {
        result = await model.find(
            formatWhere({ filter, requiredArgs }),
            null,
            formatQueryOptions({ sortBy, sortOrder, limit })
        );
    }
    const hasNextPage = result.length > limit;
    result = hasNextPage ? result.slice(0, -1) : result;
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
