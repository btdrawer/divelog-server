import { convertStringToBase64, convertBase64ToString } from "./base64Utils";
import { getFieldsToReturn } from "./routeUtils";

type Cursor = {
    sortBy: string;
    sortOrder: string;
    value: string;
};

const generateCursor = (cursor: Cursor) =>
    convertStringToBase64(JSON.stringify(cursor));

const parseCursor = (cursor: string) =>
    JSON.parse(convertBase64ToString(cursor));

const generateQueryFromCursor = ({ sortBy, sortOrder, value }: Cursor) => {
    const cursorDirection = sortOrder === "DESC" ? "$lt" : "$gt";
    return {
        [sortBy]: {
            [cursorDirection]: value
        }
    };
};

const formatLimit = (limit: string) => parseInt(limit) + 1;

const formatQueryOptions = (
    sortBy: string,
    sortOrder: string,
    limit: string
) => ({
    sort: {
        [sortBy]: sortOrder === "DESC" ? -1 : 1
    },
    limit: formatLimit(limit)
});

const runListQuery = (
    queryWithCache: any,
    model: any,
    filter: any,
    allowedFields?: string[],
    hashKey?: string
) => async (req: any) => {
    const { query } = req;
    const { limit = 10, cursor } = query;
    let { sortBy = "_id", sortOrder = "ASC" } = query;

    const fields = getFieldsToReturn(req.query.fields, allowedFields);

    let result;
    if (cursor) {
        const parsedCursor = parseCursor(cursor);
        sortBy = parsedCursor.sortBy;
        sortOrder = parsedCursor.sortOrder;
        result = await queryWithCache(hashKey, {
            model,
            filter: generateQueryFromCursor(parsedCursor),
            fields,
            options: {
                limit: formatLimit(limit)
            }
        });
    } else {
        result = await queryWithCache(hashKey, {
            model,
            filter,
            fields,
            options: formatQueryOptions(sortBy, sortOrder, limit)
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

export default runListQuery;
