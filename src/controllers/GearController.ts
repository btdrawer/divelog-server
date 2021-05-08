import {
    Services,
    Gear,
    GearDocument,
    resources
} from "@btdrawer/divelog-server-core";
import { Request } from "express";
import Controller, { ListResult } from "./Controller";

class GearController extends Controller {
    constructor(services: Services) {
        super(services);
    }

    createGear = async (req: Request): Promise<GearDocument> => {
        return Gear.create({
            brand: req.body.brand,
            name: req.body.name,
            type: req.body.type,
            owner: this.getUserId(req)
        });
    }

    listGear = async (req: Request): Promise<ListResult> => {
        return this.runListQuery(
            req,
            Gear,
            {
                owner: this.getUserId(req)
            },
            undefined,
            resources.GEAR
        );
    };

    getGear = async (req: Request): Promise<GearDocument | null> => {
        return Gear.get(req.params.id);
    }

    updateGear = async (req: Request): Promise<GearDocument | null> => {
        return Gear.update(req.params.id, req.body);
    }

    deleteGear = async (req: Request): Promise<GearDocument | null> => {
        return Gear.delete(req.params.id);
    }
}

export default GearController;
