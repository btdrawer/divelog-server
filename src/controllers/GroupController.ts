import { Request } from "express";
import { Services, Group, GroupDocument } from "@btdrawer/divelog-server-core";
import Controller from "./Controller";
import { getUserId } from "../utils";

class GroupController extends Controller {
    constructor(services: Services) {
        super(services);
    }

    async createGroup(req: Request): Promise<GroupDocument> {
        const userId = getUserId(req);
        return Group.create({
            name: req.body.group_name,
            participants: [...req.body.participants, userId],
            messages: [
                {
                    text: req.body.text,
                    sender: userId,
                    sent: new Date()
                }
            ]
        });
    }

    async sendMessage(req: Request): Promise<GroupDocument | null> {
        return Group.sendMessage(req.params.id, {
            text: req.body.text,
            sender: getUserId(req),
            sent: new Date()
        });
    }

    async getGroup(req: Request): Promise<GroupDocument | null> {
        return Group.get(req.params.id);
    }

    async addMemberToGroup(req: Request): Promise<GroupDocument | null> {
        return Group.addUser(req.params.id, req.params.userId);
    }

    async leaveGroup(req: Request): Promise<GroupDocument | null> {
        return Group.removeUser(req.params.id, getUserId(req));
    }
}

export default GroupController;
