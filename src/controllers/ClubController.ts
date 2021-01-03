import { Request } from "express";
import {
    Services,
    Club,
    ClubDocument,
    resources
} from "@btdrawer/divelog-server-core";
import Controller from "./Controller";
import { getUserId, filterPayload, runListQuery, ListResult } from "../utils";

class ClubController extends Controller {
    constructor(services: Services) {
        super(services);
    }

    async createClub(req: Request): Promise<ClubDocument> {
        return Club.create({
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            managers: [getUserId(req)],
            website: req.body.website
        });
    }

    async listClubs(req: Request): Promise<ListResult> {
        return runListQuery(
            req,
            super.services.cache.queryWithCache,
            Club,
            filterPayload({
                name: req.query.name,
                location: req.query.location
            }),
            undefined,
            resources.CLUB
        );
    }

    async getClub(req: Request): Promise<ClubDocument | null> {
        return Club.get(req.params.id, undefined, ["managers", "members"]);
    }

    async updateClub(req: Request): Promise<ClubDocument | null> {
        return Club.update(
            req.params.id,
            filterPayload({
                name: req.body.name,
                location: req.body.location,
                description: req.body.description,
                website: req.body.website
            })
        );
    }

    async addManager(req: Request): Promise<ClubDocument | null> {
        return Club.addManager(req.params.id, req.params.managerId);
    }

    async removeManager(req: Request): Promise<ClubDocument | null> {
        return Club.removeManager(req.params.id, req.params.managerId);
    }

    async addMember(req: Request): Promise<ClubDocument | null> {
        return Club.addMember(req.params.id, req.params.memberId);
    }

    async removeMember(req: Request): Promise<ClubDocument | null> {
        return Club.removeMember(req.params.id, req.params.memberId);
    }

    async joinClub(req: Request): Promise<ClubDocument | null> {
        return Club.addMember(req.params.id, getUserId(req));
    }

    async leaveClub(req: Request): Promise<ClubDocument | null> {
        return Club.removeMember(req.params.id, getUserId(req));
    }

    async deleteClub(req: Request): Promise<ClubDocument | null> {
        return Club.delete(req.params.id);
    }
}

export default ClubController;
