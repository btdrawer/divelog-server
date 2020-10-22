import express, { Request } from "express";
import { Group } from "@btdrawer/divelog-server-core";
import { getUserId, useHandlers, runListQuery } from "../utils";

const router = express.Router();

const groupRoutes = (middleware: any, queryWithCache: any) => {
    const { authentication } = middleware;

    // Create new group and post first message
    router.post(
        "/",
        authentication,
        useHandlers((req: Request) => {
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
        })
    );

    // Send message
    router.post(
        "/:id/message",
        authentication,
        useHandlers((req: Request) =>
            Group.sendMessage(req.params.id, {
                text: req.body.text,
                sender: getUserId(req),
                sent: new Date()
            })
        )
    );

    // List groups the user participates in
    router.get(
        "/",
        authentication,
        useHandlers((req: Request) =>
            runListQuery(queryWithCache, Group, {
                participants: getUserId(req)
            })(req)
        )
    );

    // Get group
    router.get(
        "/:id",
        authentication,
        useHandlers((req: Request) => Group.get(req.params.id))
    );

    // Add member to group
    router.post(
        "/:id/user/:userId",
        authentication,
        useHandlers(async (req: Request) =>
            Group.addUser(req.params.id, req.params.userId)
        )
    );

    // Leave gronp
    router.delete(
        "/:id/leave",
        authentication,
        useHandlers((req: Request) =>
            Group.removeUser(req.params.id, getUserId(req))
        )
    );

    return router;
};

export default groupRoutes;
