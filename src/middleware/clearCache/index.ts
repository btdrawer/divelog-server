import { Request, Response } from "express";
import { getUserId } from "../../utils/authUtils";

const clearCache = (clearCache: any) => async (
    req: Request,
    res: Response,
    next: any
) => {
    await next();
    clearCache(getUserId(req));
};

export default clearCache;
