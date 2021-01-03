import { Request } from "express";
import {
    Services,
    Gear,
    GearDocument,
    resources
} from "@btdrawer/divelog-server-core";
import Controller from "./Controller";
import { getUserId, runListQuery, ListResult } from "../utils";

class GearController extends Controller {
    constructor(services: Services) {
        super(services);
    }

    async createGear(req: Request): Promise<GearDocument> {
        return Gear.create({
            brand: req.body.brand,
            name: req.body.name,
            type: req.body.type,
            owner: getUserId(req)
        });
    }

    async listGear(req: Request): Promise<ListResult> {
        return runListQuery(
            req,
            super.services.cache.queryWithCache,
            Gear,
            {
                owner: getUserId(req)
            },
            undefined,
            resources.GEAR
        );
    }

    async getGear(req: Request): Promise<GearDocument | null> {
        return Gear.get(req.params.id);
    }

    async updateGear(req: Request): Promise<GearDocument | null> {
        return Gear.update(req.params.id, req.body);
    }

    async deleteGear(req: Request): Promise<GearDocument | null> {
        return Gear.delete(req.params.id);
    }
}

export default GearController;
