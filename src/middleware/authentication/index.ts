import { Request, Response } from "express";
import { User, errorCodes } from "@btdrawer/divelog-server-core";
import { getUserId, routerUrls } from "../../utils";
import { handleError } from "../../handlers";
import {
    diveAuthentication,
    clubAuthentication,
    gearAuthentication,
    groupAuthentication
} from "./hasAccess";

const authentication = async (
    req: Request,
    res: Response,
    next: any
): Promise<void> => {
    try {
        const userId = getUserId(req);
        const user = await User.get(userId);
        if (!user) {
            throw new Error(errorCodes.INVALID_AUTH);
        }
        // Additional Authentication for individual resources
        switch (req.baseUrl) {
            case routerUrls.DIVE:
                await diveAuthentication(req, userId);
                break;
            case routerUrls.CLUB:
                await clubAuthentication(req, userId);
                break;
            case routerUrls.GEAR:
                await gearAuthentication(req, userId);
                break;
            case routerUrls.GROUP:
                await groupAuthentication(req, userId);
                break;
            default:
                break;
        }
        next();
    } catch (err) {
        handleError(res, JSON.parse(err.message));
    }
};

export default authentication;
