import { Request, Response } from "express";
import { handleSuccess, handleError } from "../handlers";

export const getFieldsToReturn = (
    requestedFields?: string,
    allowedFields?: string[]
): string[] | undefined => {
    if (allowedFields) {
        return allowedFields;
    }
    if (requestedFields) {
        return requestedFields.split(",");
    }
    return undefined;
};

export const filterPayload = (payload: any): any =>
    Object.keys(payload).reduce((acc, key) => {
        const value = payload[key];
        if (value !== null && value !== undefined) {
            return {
                ...acc,
                [key]: value
            };
        }
        return acc;
    }, {});

export const populateFields = async (
    func: any,
    fields: string[]
): Promise<any> => {
    const data = await func.apply();
    await fields.reduce(
        (p, field) => p.then(() => data.populate(field).execPopulate()),
        Promise.resolve()
    );
    return data;
};

export const useHandlers = (func: any) => async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result = await func(req, res);
        handleSuccess(res, result, req.method);
    } catch (err) {
        handleError(res, err);
    }
};