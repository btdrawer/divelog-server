import { Services } from "@btdrawer/divelog-server-core";
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import {
    UserRoutes,
    DiveRoutes,
    ClubRoutes,
    GearRoutes,
    GroupRoutes
} from "./routes";

export enum RouterUrls {
    User = "/user",
    Dive = "/dive",
    Club = "/club",
    Gear = "/gear",
    Group = "/group"
}

class App {
    app: Express;
    private services: Services;

    private userRoutes: UserRoutes;
    private diveRoutes: DiveRoutes;
    private clubRoutes: ClubRoutes;
    private gearRoutes: GearRoutes;
    private groupRoutes: GroupRoutes;

    constructor(services: Services) {
        this.app = express();
        this.services = services;

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());

        this.userRoutes = new UserRoutes(this.services);
        this.diveRoutes = new DiveRoutes(this.services);
        this.clubRoutes = new ClubRoutes(this.services);
        this.gearRoutes = new GearRoutes(this.services);
        this.groupRoutes = new GroupRoutes(this.services);

        this.app.use(RouterUrls.User, this.userRoutes.router);
        this.app.use(RouterUrls.Dive, this.diveRoutes.router);
        this.app.use(RouterUrls.Club, this.clubRoutes.router);
        this.app.use(RouterUrls.Gear, this.gearRoutes.router);
        this.app.use(RouterUrls.Group, this.groupRoutes.router);

        this.app.use(this.handleError);
    }

    private formatError = (err: any): any => {
        if (err.name === "ValidationError") {
            // Validation errors from MongoDB
            return {
                code: 400,
                message: `Missing required fields: ${Object.keys(
                    err.errors
                ).join(", ")}`
            };
        }
        if (err.name === "CastError") {
            return {
                code: 400,
                message: `The following parameter is in an incorrect format: ${err.path}`
            };
        }
        return {
            code: err.statusCode || err.code || 500,
            message: err.message || "An error occurred."
        };
    }

    private handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error('err', err);
        const { code, message } = this.formatError(err);
        return res.status(code).send(message);
    }
}

export default App;
