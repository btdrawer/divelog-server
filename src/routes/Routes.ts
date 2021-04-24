import { NextFunction, Request, Response, Router } from "express";
import { errorCodes, Services } from "@btdrawer/divelog-server-core";
import { Authenticator } from "../middlewares";

abstract class Routes {
    services: Services;
    authenticate: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>;

    constructor(services: Services) {
        this.services = services;
        this.authenticate = Authenticator.authenticate;
    }

    abstract init(): Router;

    sendResult(fn: (req: Request) => any) {
        return async (req: Request, res: Response) => {
            const result = await fn(req);
            if (req.method === "GET") {
                if (!result) {
                    throw new Error(errorCodes.NOT_FOUND);
                } else if (result.length === 0) {
                    throw new Error(errorCodes.NOT_FOUND);
                }
            }
            res.send(result);
        };
    }

    async clearCache(clearCache: any) {
        return async (req: Request, res: Response, next: any) => {
            await next();
            clearCache(Authenticator.getUserId(req));
        };
    }
}

export default Routes;
