import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { Services } from "@btdrawer/divelog-server-core";
import { UserRoutes, DiveRoutes, ClubRoutes, GearRoutes } from "./routes";

class App {
    app: Express;
    private services: Services;

    private userRoutes: UserRoutes;
    private diveRoutes: DiveRoutes;
    private clubRoutes: ClubRoutes;
    private gearRoutes: GearRoutes;

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

        this.app.use("/user", this.userRoutes.router);
        this.app.use("/dive", this.diveRoutes.router);
        this.app.use("/club", this.clubRoutes.router);
        this.app.use("/gear", this.gearRoutes.router);
    }

    handleError(err: any, _: Request, res: Response) {
        let code = err.code || 500;
        let message = err.message || "An error occurred.";
        if (err.name === "ValidationError") {
            // Validation errors from MongoDB
            code = 400;
            message = `Missing required fields: ${Object.keys(err.errors).join(
                ", "
            )}`;
        } else if (err.name === "CastError") {
            code = 400;
            message = `The following parameter is in an incorrect format: ${err.path}`;
        }
        console.log({
            error: {
                code,
                message
            }
        });
        res.status(code).send(message);
    }
}

export default App;
