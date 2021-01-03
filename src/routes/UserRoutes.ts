import { Services } from "@btdrawer/divelog-server-core";
import Routes from "./Routes";
import { UserController } from "../controllers";
import { authentication } from "../middlewares";

class UserRoutes extends Routes {
    userController: UserController;

    constructor(services: Services) {
        super(services);
        this.userController = new UserController(services);
    }

    configure() {
        super.router.post(
            "/",
            super.sendResult(this.userController.createUser)
        );
        super.router.post(
            "/login",
            super.sendResult(this.userController.login)
        );
        super.router.get(
            "/",
            authentication,
            super.sendResult(this.userController.listUsers)
        );
        super.router.get(
            "/me",
            authentication,
            super.sendResult(this.userController.getMe)
        );
        super.router.get(
            "/:id",
            authentication,
            super.sendResult(this.userController.getUser)
        );
        super.router.put(
            "/",
            authentication,
            super.sendResult(this.userController.updateUser)
        );
        super.router.put(
            "/friend/:id",
            authentication,
            super.sendResult(this.userController.sendOrAcceptFriendRequest)
        );
        super.router.delete(
            "/friend/:id",
            authentication,
            super.sendResult(this.userController.removeFriend)
        );
        super.router.delete(
            "/",
            authentication,
            super.sendResult(this.userController.deleteUser)
        );
    }
}

export default UserRoutes;
