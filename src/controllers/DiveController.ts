import {
    Services,
    Dive,
    DiveDocument,
    resources
} from "@btdrawer/divelog-server-core";
import { Request } from "express";
import Controller, { ListResult } from "./Controller";

class DiveController extends Controller {
    constructor(services: Services) {
        super(services);
    }

    createDive = async (req: Request): Promise<DiveDocument> => {
        return Dive.create({
            timeIn: req.body.time_in,
            timeOut: req.body.time_out,
            bottomTime: req.body.bottom_time,
            safetyStopTime: req.body.safety_stop_time,
            maxDepth: req.body.max_depth,
            location: req.body.location,
            description: req.body.description,
            club: req.body.club_id,
            user: this.getUserId(req),
            buddies: req.body.buddies,
            gear: req.body.gear,
            public: req.body.is_public
        });
    }

    listDives = async (req: Request): Promise<ListResult> => {
        return this.runListQuery(
            req,
            Dive,
            req.query.user
                ? {
                      user: req.query.user,
                      public: true
                  }
                : {
                      user: this.getUserId(req)
                  },
            undefined,
            resources.DIVE
        );
    };

    getDive = async (req: Request): Promise<DiveDocument | null> => {
        return Dive.get(
            req.params.id,
            Controller.getFieldsToReturn(<string>req.query.fields),
            ["user", "buddies", "club", "gear"]
        );
    }

    updateDive = async (req: Request): Promise<DiveDocument | null> => {
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

    deleteDive = async (req: Request): Promise<DiveDocument | null> => {
        return Dive.delete(req.params.id);
    }
}

export default DiveController;
