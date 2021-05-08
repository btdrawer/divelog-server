import express, { Router } from "express";
import { Services } from "@btdrawer/divelog-server-core";
import Routes from "./Routes";
import { DiveController } from "../controllers";

class DiveRoutes extends Routes {
    diveController: DiveController;
    router: Router;

    constructor(services: Services) {
        super(services);
        this.diveController = new DiveController(services);
        this.router = this.init();
    }

    init(): Router {
        const router = express.Router();
        router.post(
            "/",
            this.authenticate,
            super.sendResult(this.diveController.createDive)
        );
        router.get(
            "/",
            this.authenticate,
            super.sendResult(this.diveController.listDives)
        );
        router.get(
            "/:id",
            this.authenticate,
            super.sendResult(this.diveController.getDive)
        );
        router.put(
            "/:id",
            this.authenticate,
            super.sendResult(this.diveController.updateDive)
        );
        router.delete(
            "/:id",
            this.authenticate,
            super.sendResult(this.diveController.deleteDive)
        );
        return router;
    }
}

export default DiveRoutes;
