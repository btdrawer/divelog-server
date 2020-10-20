import express from "express";
import { Club, resources } from "@btdrawer/divelog-server-core";
const {
    getUserId,
    filterPayload,
    useHandlers,
    runListQuery
} = require("../utils");

const router = express.Router();

const clubRoutes = (middleware: any, queryWithCache: any) => {
    const { authentication } = middleware;

    // Create new club
    router.post(
        "/",
        authentication,
        useHandlers((req: any) =>
            Club.create({
                name: req.body.name,
                location: req.body.location,
                description: req.body.description,
                managers: [getUserId(req)],
                website: req.body.website
            })
        )
    );

    // List all clubs
    router.get(
        "/",
        authentication,
        useHandlers((req: any) =>
            runListQuery(
                queryWithCache,
                Club,
                filterPayload({
                    name: req.query.name,
                    location: req.query.location
                }),
                undefined,
                resources.CLUB
            )(req)
        )
    );

    // Get club by ID
    router.get(
        "/:id",
        authentication,
        useHandlers((req: any) =>
            Club.get(req.params.id, ["managers", "members"])
        )
    );

    // Update club
    router.put(
        "/:id",
        authentication,
        useHandlers((req: any) =>
            Club.update(
                req.params.id,
                filterPayload({
                    name: req.body.name,
                    location: req.body.location,
                    description: req.body.description,
                    website: req.body.website
                })
            )
        )
    );

    // Add manager
    router.post(
        "/:id/manager/:managerId",
        authentication,
        useHandlers((req: any) =>
            Club.addManager(req.params.id, req.params.managerId)
        )
    );

    // Remove manager
    router.delete(
        "/:id/manager/:managerId",
        authentication,
        useHandlers((req: any) =>
            Club.removeManager(req.params.id, req.params.managerId)
        )
    );

    // Add member
    router.post(
        "/:id/member/:memberId",
        authentication,
        useHandlers((req: any) =>
            Club.addMember(req.params.id, req.params.memberId)
        )
    );

    // Remove member
    router.delete(
        "/:id/member/:memberId",
        authentication,
        useHandlers((req: any) =>
            Club.removeMember(req.params.id, req.params.memberId)
        )
    );

    // Join group
    router.post(
        "/:id/member",
        authentication,
        useHandlers((req: any) => Club.addMember(req.params.id, getUserId(req)))
    );

    // Leave group
    router.delete(
        "/:id/member",
        authentication,
        useHandlers((req: any) =>
            Club.removeMember(req.params.id, getUserId(req))
        )
    );

    // Delete club
    router.delete(
        "/:id",
        authentication,
        useHandlers((req: any) => Club.delete(req.params.id))
    );

    return router;
};

export default clubRoutes;
