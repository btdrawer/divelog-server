import { errorCodes, Services } from "@btdrawer/divelog-server-core";
import { NextFunction, Request, Response, Router } from "express";
import { isEmpty } from 'lodash';
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
            if (req.method === "GET" && isEmpty(result)) {
                throw new Error(errorCodes.NOT_FOUND);
            }
            return res.send(result);
        };
    }

    async clearCache() {
        return async (req: Request, res: Response, next: NextFunction) => {
            next();
            this.services.cache.clearCache(
                Authenticator.getUserId(req)
            );
        };
    }
}

export default Routes;
