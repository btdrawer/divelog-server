import { Services } from "@btdrawer/divelog-server-core";
import express, { Express } from "express";
import { Server } from 'http';
import cookieParser from "cookie-parser";
import {
    UserRoutes,
    DiveRoutes,
    ClubRoutes,
    GearRoutes,
    GroupRoutes
} from "./routes";
import { handleError } from './ErrorHandling';

export enum RouterUrls {
    User = "/user",
    Dive = "/dive",
    Club = "/club",
    Gear = "/gear",
    Group = "/group"
}

class AppWrapper {
    app: Express;
    services: Services;

    constructor(app: Express, services: Services) {
        this.app = app;
        this.services = services;
    }

    static async init(): Promise<AppWrapper> {
        const services = await Services.launchServices();
        const app = express();
    
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
    
        const { router: userRouter } = new UserRoutes(services);
        const { router: diveRouter } = new DiveRoutes(services);
        const { router: clubRouter } = new ClubRoutes(services);
        const { router: gearRouter } = new GearRoutes(services);
        const { router: groupRouter } = new GroupRoutes(services);
    
        app.use(RouterUrls.User, userRouter);
        app.use(RouterUrls.Dive, diveRouter);
        app.use(RouterUrls.Club, clubRouter);
        app.use(RouterUrls.Gear, gearRouter);
        app.use(RouterUrls.Group, groupRouter);
    
        app.use(handleError);
    
        return new AppWrapper(app, services);
    };

    close = async (server: Server) => {
        return new Promise(resolve => {
            this.services.closeServices();
            server.close(() => {
                console.log("Server closed.");
                resolve(null);
             });
        })
    }
}

export default AppWrapper;
