import express, { Request } from "express";
import { Club, resources } from "@btdrawer/divelog-server-core";
import { getUserId, filterPayload, useHandlers, runListQuery } from "../utils";

const router = express.Router();

const clubRoutes = (middleware: any, queryWithCache: any) => {
    const { authentication } = middleware;

    // Create new club
    router.post(
        "/",
        authentication,
        useHandlers((req: Request) =>
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
        useHandlers((req: Request) =>
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
        useHandlers((req: Request) =>
            Club.get(req.params.id, ["managers", "members"])
        )
    );

    // Update club
    router.put(
        "/:id",
        authentication,
        useHandlers((req: Request) =>
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
        useHandlers((req: Request) =>
            Club.addManager(req.params.id, req.params.managerId)
        )
    );

    // Remove manager
    router.delete(
        "/:id/manager/:managerId",
        authentication,
        useHandlers((req: Request) =>
            Club.removeManager(req.params.id, req.params.managerId)
        )
    );

    // Add member
    router.post(
        "/:id/member/:memberId",
        authentication,
        useHandlers((req: Request) =>
            Club.addMember(req.params.id, req.params.memberId)
        )
    );

    // Remove member
    router.delete(
        "/:id/member/:memberId",
        authentication,
        useHandlers((req: Request) =>
            Club.removeMember(req.params.id, req.params.memberId)
        )
    );

    // Join group
    router.post(
        "/:id/member",
        authentication,
        useHandlers((req: Request) =>
            Club.addMember(req.params.id, getUserId(req))
        )
    );

    // Leave group
    router.delete(
        "/:id/member",
        authentication,
        useHandlers((req: Request) =>
            Club.removeMember(req.params.id, getUserId(req))
        )
    );

    // Delete club
    router.delete(
        "/:id",
        authentication,
        useHandlers((req: Request) => Club.delete(req.params.id))
    );

    return router;
};

export default clubRoutes;
