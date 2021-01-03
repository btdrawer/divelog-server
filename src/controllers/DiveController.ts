import { Request } from "express";
import {
    Services,
    Dive,
    DiveDocument,
    resources
} from "@btdrawer/divelog-server-core";
import Controller from "./Controller";
import {
    getUserId,
    ListResult,
    runListQuery,
    getFieldsToReturn
} from "../utils";

class DiveController extends Controller {
    constructor(services: Services) {
        super(services);
    }

    async createDive(req: Request): Promise<DiveDocument> {
        return Dive.create({
            timeIn: req.body.time_in,
            timeOut: req.body.time_out,
            bottomTime: req.body.bottom_time,
            safetyStopTime: req.body.safety_stop_time,
            maxDepth: req.body.max_depth,
            location: req.body.location,
            description: req.body.description,
            club: req.body.club_id,
            user: getUserId(req),
            buddies: req.body.buddies,
            gear: req.body.gear,
            public: req.body.is_public
        });
    }

    async listDives(req: Request): Promise<ListResult> {
        return runListQuery(
            req,
            super.services.cache.queryWithCache,
            Dive,
            req.query.user
                ? {
                      user: req.query.user,
                      public: true
                  }
                : {
                      user: getUserId(req)
                  },
            undefined,
            resources.DIVE
        );
    }

    async getDive(req: Request): Promise<DiveDocument | null> {
        return Dive.get(
            req.params.id,
            getFieldsToReturn(<string>req.query.fields),
            ["user", "buddies", "club", "gear"]
        );
    }

    async updateDive(req: Request): Promise<DiveDocument | null> {
        return Dive.update(req.params.id, {
            timeIn: req.body.time_in,
            timeOut: req.body.time_out,
            bottomTime: req.body.bottom_time,
            safetyStopTime: req.body.safety_stop_time,
            maxDepth: req.body.max_depth,
            location: req.body.location,
            description: req.body.description,
            club: req.body.club,
            buddies: req.body.buddies,
            gear: req.body.gear,
            public: req.body.public
        });
    }

    async deleteDive(req: Request): Promise<DiveDocument | null> {
        return Dive.delete(req.params.id);
    }
}

export default DiveController;
