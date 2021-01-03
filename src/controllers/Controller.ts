import { Services } from "@btdrawer/divelog-server-core";

abstract class Controller {
    services: Services;

    constructor(services: Services) {
        this.services = services;
    }
}

export default Controller;
