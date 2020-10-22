import express, { Request } from "express";
import { Dive, resources } from "@btdrawer/divelog-server-core";
import {
    getUserId,
    getFieldsToReturn,
    useHandlers,
    runListQuery
} from "../utils";

const router = express.Router();

const diveRoutes = (middleware: any, queryWithCache: any) => {
    const { authentication, clearCache } = middleware;

    // Create new dive
    router.post(
        "/",
        authentication,
        clearCache,
        useHandlers((req: Request) =>
            Dive.create({
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
            })
        )
    );

    // List the authenticated user's dives
    router.get(
        "/",
        authentication,
        useHandlers((req: Request) =>
            runListQuery(
                queryWithCache,
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
            )(req)
        )
    );

    // Get dive by ID
    router.get(
        "/:id",
        authentication,
        useHandlers((req: Request) =>
            Dive.get(
                req.params.id,
                getFieldsToReturn(<string>req.query.fields),
                ["user", "buddies", "club", "gear"]
            )
        )
    );

    // Update dive
    router.put(
        "/:id",
        authentication,
        clearCache,
        useHandlers((req: Request) =>
            Dive.update(req.params.id, {
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
            })
        )
    );

    // Delete dive
    router.delete(
        "/:id",
        authentication,
        clearCache,
        useHandlers((req: Request) => Dive.delete(req.params.id))
    );

    return router;
};

export default diveRoutes;
