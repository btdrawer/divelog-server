import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { errorCodes } from "@btdrawer/divelog-server-core";

const getAuthData = (req: Request): any => {
    const header = req.header("Authorization");
    if (!header) {
        throw new Error(errorCodes.INVALID_AUTH);
    }
    const token = header.replace("Bearer ", "");
    return jwt.verify(token, <string>process.env.JWT_KEY);
};

export const getUserId = (req: Request): string => getAuthData(req).id;

export const signJwt = (id: string): string =>
    jwt.sign({ id }, <string>process.env.JWT_KEY, {
        expiresIn: "3h"
    });
