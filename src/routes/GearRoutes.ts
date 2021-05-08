import express, { Router } from "express";
import { Services } from "@btdrawer/divelog-server-core";
import Routes from "./Routes";
import { GearController } from "../controllers";

class GearRoutes extends Routes {
    gearController: GearController;
    router: Router;

    constructor(services: Services) {
        super(services);
        this.gearController = new GearController(services);
        this.router = this.init();
    }

    init(): Router {
        const router = express.Router();
        router.post(
            "/",
            this.authenticate,
            this.clearCache,
            super.sendResult(this.gearController.createGear)
        );
        router.get(
            "/",
            this.authenticate,
            super.sendResult(this.gearController.listGear)
        );
        router.get(
            "/:id",
            this.authenticate,
            super.sendResult(this.gearController.getGear)
        );
        router.put(
            "/:id",
            this.authenticate,
            super.sendResult(this.gearController.updateGear)
        );
        router.delete(
            "/:id",
            this.authenticate,
            this.clearCache,
            super.sendResult(this.gearController.deleteGear)
        );
        return router;
    }
}

export default GearRoutes;
