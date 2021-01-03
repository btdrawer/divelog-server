import { Services } from "@btdrawer/divelog-server-core";
import Routes from "./Routes";
import { GearController } from "../controllers";
import { authentication } from "../middlewares";

class GearRoutes extends Routes {
    gearController: GearController;

    constructor(services: Services) {
        super(services);
        this.gearController = new GearController(services);
    }

    configure() {
        super.router.post(
            "/",
            authentication,
            super.services.cache.clearCache,
            super.sendResult(this.gearController.createGear)
        );
        super.router.get(
            "/",
            authentication,
            super.sendResult(this.gearController.listGear)
        );
        super.router.get(
            "/:id",
            authentication,
            super.sendResult(this.gearController.getGear)
        );
        super.router.put(
            "/:id",
            authentication,
            super.sendResult(this.gearController.updateGear)
        );
        super.router.delete(
            "/:id",
            authentication,
            super.services.cache.clearCache,
            super.sendResult(this.gearController.deleteGear)
        );
    }
}

export default GearRoutes;
