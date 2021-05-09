import { Request } from "express";
import { Services, Group, GroupDocument } from "@btdrawer/divelog-server-core";
import Controller, { ListResult } from "./Controller";

class GroupController extends Controller {
    constructor(services: Services) {
        super(services);
    }

    createGroup = async (req: Request): Promise<GroupDocument> => {
        const userId = this.getUserId(req);
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
    };

    sendMessage = async (req: Request): Promise<GroupDocument | null> => {
        return Group.sendMessage(req.params.id, {
            text: req.body.text,
            sender: this.getUserId(req),
            sent: new Date()
        });
    };

    listGroups = async (req: Request): Promise<ListResult> => {
        return this.runListQuery(req, Group, {
            participants: this.getUserId(req)
        });
    };

    getGroup = async (req: Request): Promise<GroupDocument | null> => {
        return Group.get(req.params.id);
    };

    addMemberToGroup = (req: Request): Promise<GroupDocument | null> => {
        return Group.addUser(req.params.id, req.params.userId);
    };

    leaveGroup = async (req: Request): Promise<GroupDocument | null> => {
        return Group.removeUser(req.params.id, this.getUserId(req));
    };
}

export default GroupController;
