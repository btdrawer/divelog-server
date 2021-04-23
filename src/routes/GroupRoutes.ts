import express, { Router } from "express";
import { Services } from "@btdrawer/divelog-server-core";
import Routes from "./Routes";
import { GroupController } from "../controllers";

class GroupRoutes extends Routes {
    groupController: GroupController;
    router: Router;

    constructor(services: Services) {
        super(services);
        this.groupController = new GroupController(services);
        this.router = this.init();
    }

    init(): Router {
        const router = express.Router();
        router.post(
            "/",
            this.authenticate,
            super.sendResult(this.groupController.createGroup)
        );
        router.post(
            "/:id/message",
            this.authenticate,
            super.sendResult(this.groupController.sendMessage)
        );
        router.get(
            "/:id",
            this.authenticate,
            super.sendResult(this.groupController.getGroup)
        );
        router.post(
            "/:id/user/:userId",
            this.authenticate,
            super.sendResult(this.groupController.addMemberToGroup)
        );
        router.delete(
            "/:id/leave",
            this.authenticate,
            super.sendResult(this.groupController.leaveGroup)
        );
        return router;
    }
}

export default GroupRoutes;
