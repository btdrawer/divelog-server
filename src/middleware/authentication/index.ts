import { User, errorCodes } from "@btdrawer/divelog-server-core";
import { getAuthData, routerUrls } from "../../utils";
import { handleError } from "../../handlers";
import {
    diveAuthentication,
    clubAuthentication,
    gearAuthentication,
    groupAuthentication
} from "./hasAccess";

const authentication = async (req: any, res: any, next: any) => {
    try {
        const data = getAuthData(req);
        const user = await User.get(data._id);
        if (!user) {
            throw new Error(errorCodes.INVALID_AUTH);
        }
        // Additional Authentication for individual resources
        switch (req.baseUrl) {
            case routerUrls.DIVE:
                await diveAuthentication(req, data);
                break;
            case routerUrls.CLUB:
                await clubAuthentication(req, data);
                break;
            case routerUrls.GEAR:
                await gearAuthentication(req, data);
                break;
            case routerUrls.GROUP:
                await groupAuthentication(req, data);
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
