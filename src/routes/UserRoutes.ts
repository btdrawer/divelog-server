import express, { Router } from "express";
import { Services } from "@btdrawer/divelog-server-core";
import Routes from "./Routes";
import { UserController } from "../controllers";

class UserRoutes extends Routes {
    userController: UserController;
    router: Router;

    constructor(services: Services) {
        super(services);
        this.userController = new UserController(services);
        this.router = this.init();
    }

    init(): Router {
        const router = express.Router();
        router.post("/", super.sendResult(this.userController.createUser));
        router.post("/login", super.sendResult(this.userController.login));
        router.get(
            "/",
            this.authenticate,
            super.sendResult(this.userController.listUsers)
        );
        router.get(
            "/me",
            this.authenticate,
            super.sendResult(this.userController.getMe)
        );
        router.get(
            "/:id",
            this.authenticate,
            super.sendResult(this.userController.getUser)
        );
        router.put(
            "/",
            this.authenticate,
            super.sendResult(this.userController.updateUser)
        );
        router.put(
            "/friend/:id",
            this.authenticate,
            super.sendResult(this.userController.sendOrAcceptFriendRequest)
        );
        router.delete(
            "/friend/:id",
            this.authenticate,
            super.sendResult(this.userController.removeFriend)
        );
        router.delete(
            "/",
            this.authenticate,
            super.sendResult(this.userController.deleteUser)
        );
        return router;
    }
}

export default UserRoutes;
