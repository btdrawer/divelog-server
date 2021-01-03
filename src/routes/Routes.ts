import express, { Request, Response, Router } from "express";
import { errorCodes, Services } from "@btdrawer/divelog-server-core";

abstract class Routes {
    router: Router;
    services: Services;

    constructor(services: Services) {
        this.router = express.Router();
        this.services = services;
        this.configure();
    }

    abstract configure(): void;

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
}

export default Routes;
