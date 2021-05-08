import { Services, IResource } from "@btdrawer/divelog-server-core";
import { Request } from 'express';
import { Authenticator } from '../middlewares';

export interface Cursor {
    sortBy: string;
    sortOrder: string;
    value: string;
};

export interface ListResult {
    data: any;
    pageInfo: {
        hasNextPage: boolean;
        cursor: string | null;
    };
};

abstract class Controller {
    services: Services;
    getUserId: (req: Request) => string;
    signJwt: (id: string) => string;

    constructor(services: Services) {
        this.services = services;
        this.getUserId = Authenticator.getUserId;
        this.signJwt = Authenticator.signJwt;
    }

    static getFieldsToReturn(
        requestedFields?: string,
        allowedFields?: string[]
    ): string[] | undefined {
        if (allowedFields) {
            return allowedFields;
        }
        if (requestedFields) {
            return requestedFields.split(",");
        }
        return undefined;
    }

    static filterPayload(payload: any): any {
        return Object.keys(payload).reduce((acc, key) => {
            const value = payload[key];
            if (value !== null && value !== undefined) {
                return {
                    ...acc,
                    [key]: value
                };
            }
            return acc;
        }, {});
    }

    static async populateFields(func: any, fields: string[]): Promise<any> {
        const data = await func.apply();
        await fields.reduce(
            (p, field) => p.then(() => data.populate(field).execPopulate()),
            Promise.resolve()
        );
        return data;
    }

    private static generateCursor(cursor: Cursor): string {
        return Buffer.from(JSON.stringify(cursor))
            .toString('base64');
    }

    private static parseCursor(cursor: string): Cursor {
        return JSON.parse(
            Buffer.from(cursor).toString('ascii')
        );
    }

    private static generateQueryFromCursor({ sortBy, sortOrder, value }: Cursor) {
        const cursorDirection = sortOrder === "DESC" ? "$lt" : "$gt";
        return {
            [sortBy]: {
                [cursorDirection]: value
            }
        };
    }

    private static formatLimit (limit: string) {
        return parseInt(limit) + 1;
    }

    private static formatQueryOptions(
        sortBy: string,
        sortOrder: string,
        limit: string
    ) {
        return {
            sort: {
                [sortBy]: sortOrder === "DESC" ? -1 : 1
            },
            limit: Controller.formatLimit(limit)
        }
    };

    private async getResultWithCursor(
        cursor: string,
        hashKey: string,
        model: any,
        fields: string[] | undefined,
        limit: string
    ) {
        const parsedCursor = Controller.parseCursor(<string>cursor);
        return this.services.cache.queryWithCache(hashKey, {
            model,
            filter: Controller.generateQueryFromCursor(parsedCursor),
            fields,
            options: {
                limit: Controller.formatLimit(<string>limit)
            }
        });
    }

    private async getResultWithoutCursor (
        sortBy: string,
        sortOrder: string,
        hashKey: string,
        model: any,
        filter: any,
        fields: string[] | undefined,
        limit: string
    ) {
        return this.services.cache.queryWithCache(hashKey, {
            model,
            filter,
            fields,
            options: Controller.formatQueryOptions(
                <string>sortBy,
                <string>sortOrder,
                <string>limit
            )
        });
    };

    async runListQuery(
        {
            query: {
                limit = "10",
                cursor,
                sortBy = "_id",
                sortOrder = "ASC",
                fields
            }
        }: Request,
        model: IResource<any, any, any>,
        filter?: object,
        allowedFields?: string[],
        hashKey?: string
    ): Promise<ListResult> {
        const fieldsToReturn = Controller.getFieldsToReturn(
            <string>fields, 
            allowedFields
        );
        const result = cursor
            ? await this.getResultWithCursor(
                  <string>cursor,
                  <string>hashKey,
                  model,
                  fieldsToReturn,
                  <string>limit
              )
            : await this.getResultWithoutCursor(
                  <string>sortBy,
                  <string>sortOrder,
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
                    ? Controller.generateCursor({
                          sortBy: <string>sortBy,
                          sortOrder: <string>sortOrder,
                          value: result[result.length - 1][<string>sortBy]
                      })
                    : null
            }
        };
    }
}

export default Controller;
