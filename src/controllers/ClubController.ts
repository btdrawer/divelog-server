import { Request } from "express";
import {
    Services,
    Club,
    ClubDocument,
    resources
} from "@btdrawer/divelog-server-core";
import Controller, { ListResult } from "./Controller";

class ClubController extends Controller {
    constructor(services: Services) {
        super(services);
    }

    createClub = async (req: Request): Promise<ClubDocument> => {
        return Club.create({
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            managers: [this.getUserId(req)],
            website: req.body.website
        });
    };

    listClubs = async (req: Request): Promise<ListResult> => {
        return this.runListQuery(
            req,
            Club,
            Controller.filterPayload({
                name: req.query.name,
                location: req.query.location
            }),
            undefined,
            resources.CLUB
        );
    };

    getClub = async (req: Request): Promise<ClubDocument | null> => {
        return Club.get(req.params.id, undefined, ["managers", "members"]);
    };

    updateClub = async (req: Request): Promise<ClubDocument | null> => {
        return Club.update(
            req.params.id,
            Controller.filterPayload({
                name: req.body.name,
                location: req.body.location,
                description: req.body.description,
                website: req.body.website
            })
        );
    };

    addManager = async (req: Request): Promise<ClubDocument | null> => {
        return Club.addManager(req.params.id, req.params.managerId);
    };

    removeManager = async (req: Request): Promise<ClubDocument | null> => {
        return Club.removeManager(req.params.id, req.params.managerId);
    };

    addMember = async (req: Request): Promise<ClubDocument | null> => {
        return Club.addMember(req.params.id, req.params.memberId);
    };

    removeMember = async (req: Request): Promise<ClubDocument | null> => {
        return Club.removeMember(req.params.id, req.params.memberId);
    };

    joinClub = async (req: Request): Promise<ClubDocument | null> => {
        return Club.addMember(req.params.id, this.getUserId(req));
    };

    leaveClub = async (req: Request): Promise<ClubDocument | null> => {
        return Club.removeMember(req.params.id, this.getUserId(req));
    };

    deleteClub = async (req: Request): Promise<ClubDocument | null> => {
        return Club.delete(req.params.id);
    };
}

export default ClubController;
