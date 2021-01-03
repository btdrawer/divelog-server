import { Services } from "@btdrawer/divelog-server-core";
import Routes from "./Routes";
import { DiveController } from "../controllers";
import { authentication } from "../middlewares";

class DiveRoutes extends Routes {
    diveController: DiveController;

    constructor(services: Services) {
        super(services);
        this.diveController = new DiveController(services);
    }

    configure() {
        super.router.post(
            "/",
            authentication,
            super.sendResult(this.diveController.createDive)
        );
        super.router.get(
            "/",
            authentication,
            super.sendResult(this.diveController.listDives)
        );
        super.router.get(
            "/:id",
            authentication,
            super.sendResult(this.diveController.getDive)
        );
        super.router.put(
            "/:id",
            authentication,
            super.sendResult(this.diveController.updateDive)
        );
        super.router.delete(
            "/:id",
            authentication,
            super.sendResult(this.diveController.deleteDive)
        );
    }
}

export default DiveRoutes;
