import { Request } from "express";
import { IResource } from "@btdrawer/divelog-server-core";
import { convertStringToBase64, convertBase64ToString } from "./base64Utils";
import { getFieldsToReturn } from "./routeUtils";

type Cursor = {
    sortBy: string;
    sortOrder: string;
    value: string;
};

export type ListResult = {
    data: any;
    pageInfo: {
        hasNextPage: boolean;
        cursor: string | null;
    };
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

const getResultWithCursor = async (
    cursor: string,
    queryWithCache: Function,
    hashKey: string,
    model: any,
    fields: string[] | undefined,
    limit: string
) => {
    const parsedCursor = parseCursor(<string>cursor);
    return queryWithCache(hashKey, {
        model,
        filter: generateQueryFromCursor(parsedCursor),
        fields,
        options: {
            limit: formatLimit(<string>limit)
        }
    });
};

const getResultWithoutCursor = async (
    sortBy: string,
    sortOrder: string,
    queryWithCache: Function,
    hashKey: string,
    model: any,
    filter: any,
    fields: string[] | undefined,
    limit: string
) => {
    return queryWithCache(hashKey, {
        model,
        filter,
        fields,
        options: formatQueryOptions(
            <string>sortBy,
            <string>sortOrder,
            <string>limit
        )
    });
};

async function runListQuery(
    {
        query: {
            limit = "10",
            cursor,
            sortBy = "_id",
            sortOrder = "ASC",
            fields
        }
    }: Request,
    queryWithCache: Function,
    model: IResource<any, any, any>,
    filter?: object,
    allowedFields?: string[],
    hashKey?: string
): Promise<ListResult> {
    const fieldsToReturn = getFieldsToReturn(<string>fields, allowedFields);
    const result = cursor
        ? await getResultWithCursor(
              <string>cursor,
              queryWithCache,
              <string>hashKey,
              model,
              fieldsToReturn,
              <string>limit
          )
        : await getResultWithoutCursor(
              <string>sortBy,
              <string>sortOrder,
              queryWithCache,
              <string>hashKey,
              model,
              filter,
              fieldsToReturn,
              <string>limit
          );
    const hasNextPage = result.length > limit;
    return {
        data: hasNextPage ? result.slice(0, limit) : result,
        pageInfo: {
            hasNextPage,
            cursor: hasNextPage
                ? generateCursor({
                      sortBy: <string>sortBy,
                      sortOrder: <string>sortOrder,
                      value: result[result.length - 1][<string>sortBy]
                  })
                : null
        }
    };
}

export default runListQuery;
