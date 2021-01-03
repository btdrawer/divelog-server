import { Services } from "@btdrawer/divelog-server-core";
import Routes from "./Routes";
import { ClubController } from "../controllers";
import { authentication } from "../middlewares";

class ClubRoutes extends Routes {
    clubController: ClubController;

    constructor(services: Services) {
        super(services);
        this.clubController = new ClubController(services);
    }

    configure() {
        super.router.post(
            "/",
            authentication,
            super.sendResult(this.clubController.createClub)
        );
        super.router.get(
            "/",
            authentication,
            super.sendResult(this.clubController.listClubs)
        );
        super.router.get(
            "/:id",
            authentication,
            super.sendResult(this.clubController.getClub)
        );
        super.router.put(
            "/:id",
            authentication,
            super.sendResult(this.clubController.updateClub)
        );
        super.router.post(
            "/:id/manager/:managerId",
            authentication,
            this.clubController.addManager
        );
        super.router.delete(
            "/:id/manager/:managerId",
            authentication,
            this.clubController.removeManager
        );
        super.router.post(
            "/:id/member/:memberId",
            authentication,
            this.clubController.addMember
        );
        super.router.delete(
            "/:id/member/:memberId",
            authentication,
            this.clubController.removeMember
        );
        super.router.post(
            "/:id/member",
            authentication,
            this.clubController.joinClub
        );
        super.router.delete(
            "/:id/member",
            authentication,
            this.clubController.leaveClub
        );
        super.router.delete(
            "/:id",
            authentication,
            this.clubController.deleteClub
        );
    }
}

export default ClubRoutes;
