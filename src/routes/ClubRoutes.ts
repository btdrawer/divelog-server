import express, { Router } from "express";
import { Services } from "@btdrawer/divelog-server-core";
import Routes from "./Routes";
import { ClubController } from "../controllers";

class ClubRoutes extends Routes {
    clubController: ClubController;
    router: Router;

    constructor(services: Services) {
        super(services);
        this.clubController = new ClubController(services);
        this.router = this.init();
    }

    init(): Router {
        const router = express.Router();
        router.post(
            "/",
            this.authenticate,
            super.sendResult(this.clubController.createClub)
        );
        router.get(
            "/",
            this.authenticate,
            super.sendResult(this.clubController.listClubs)
        );
        router.get(
            "/:id",
            this.authenticate,
            super.sendResult(this.clubController.getClub)
        );
        router.put(
            "/:id",
            this.authenticate,
            super.sendResult(this.clubController.updateClub)
        );
        router.post(
            "/:id/manager/:managerId",
            this.authenticate,
            super.sendResult(this.clubController.addManager)
        );
        router.delete(
            "/:id/manager/:managerId",
            this.authenticate,
            super.sendResult(this.clubController.removeManager)
        );
        router.post(
            "/:id/member/:memberId",
            this.authenticate,
            super.sendResult(this.clubController.addMember)
        );
        router.delete(
            "/:id/member/:memberId",
            this.authenticate,
            super.sendResult(this.clubController.removeMember)
        );
        router.post(
            "/:id/member",
            this.authenticate,
            super.sendResult(this.clubController.joinClub)
        );
        router.delete(
            "/:id/member",
            this.authenticate,
            super.sendResult(this.clubController.leaveClub)
        );
        router.delete(
            "/:id",
            this.authenticate,
            super.sendResult(this.clubController.deleteClub)
        );
        return router;
    }
}

export default ClubRoutes;
