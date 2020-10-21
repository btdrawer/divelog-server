import { Response } from "express";
import { errorCodes } from "@btdrawer/divelog-server-core";

export const handleSuccess = (res: Response, data: any, method: string) => {
    try {
        if (method === "GET") {
            if (!data) throw new Error(errorCodes.NOT_FOUND);
            else if (data.length === 0) throw new Error(errorCodes.NOT_FOUND);
        }
        res.status(200).send(data);
    } catch (err) {
        handleError(res, err);
    }
};

export const handleError = (res: Response, err: any) => {
    let code = err.code || 500;
    let message = err.message || "An error occurred.";
    if (err.name === "ValidationError") {
        // Validation errors from MongoDB
        code = 400;
        message = `Missing required fields: ${Object.keys(err.errors).join(
            ", "
        )}`;
    } else if (err.name === "CastError") {
        code = 400;
        message = `The following parameter is in an incorrect format: ${err.path}`;
    }
    console.log({
        error: {
            code,
            message
        }
    });
    res.status(code).send(message);
};
