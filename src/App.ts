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
        this.app.use(this.handleError);

        this.userRoutes = new UserRoutes(this.services);
        this.diveRoutes = new DiveRoutes(this.services);
        this.clubRoutes = new ClubRoutes(this.services);
        this.gearRoutes = new GearRoutes(this.services);
        this.groupRoutes = new GroupRoutes(this.services);

        this.app.use("/user", this.userRoutes.router);
        this.app.use("/dive", this.diveRoutes.router);
        this.app.use("/club", this.clubRoutes.router);
        this.app.use("/gear", this.gearRoutes.router);
        this.app.use("/group", this.groupRoutes.router);
    }

    private formatError(err: any): any {
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
            code: err.code || 500,
            message: err.message || "An error occurred."
        };
    }

    handleError(err: any, req: Request, res: Response, next: NextFunction) {
        const { code, message } = this.formatError(err);
        res.status(code).send(message);
    }
}

export default App;
