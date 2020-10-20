import * as jwt from "jsonwebtoken";
import { errorCodes } from "@btdrawer/divelog-server-core";

export const getAuthData = (req: any): any => {
    if (!req.header("Authorization")) {
        throw new Error(errorCodes.INVALID_AUTH);
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    return jwt.verify(token, <string>process.env.JWT_KEY);
};

export const getUserId = (req: any) => getAuthData(req)._id;

export const signJwt = (id: string) =>
    jwt.sign({ _id: id }, <string>process.env.JWT_KEY, {
        expiresIn: "3h"
    });
