import { errorCodes, Services } from "@btdrawer/divelog-server-core";
import { NextFunction, Request, Response, Router } from "express";
import { isEmpty } from "lodash";
import { Authenticator } from "../middlewares";
import { handleError } from "../ErrorHandling";

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

    sendResult(fn: (r: Request) => Promise<any>) {
        return async (req: Request, res: Response): Promise<any> => {
            try {
                const result = await fn(req);
                if (req.method === "GET" && isEmpty(result)) {
                    throw new Error(errorCodes.NOT_FOUND);
                }
                return res.send(result);
            } catch (err) {
                return handleError(err, req, res);
            }
        };
    }

    clearCache = (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): void => {
        this.services.cache.clearCache(Authenticator.getUserId(req));
        next();
    };
}

export default Routes;
