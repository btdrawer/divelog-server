import express, { Request } from "express";
import { Gear, resources } from "@btdrawer/divelog-server-core";
import { getUserId, useHandlers, runListQuery } from "../utils";

const router = express.Router();

const gearRoutes = (middleware: any, queryWithCache: any) => {
    const { authentication, clearCache } = middleware;

    // Create gear
    router.post(
        "/",
        authentication,
        clearCache,
        useHandlers((req: Request) =>
            Gear.create({
                brand: req.body.brand,
                name: req.body.name,
                type: req.body.type,
                owner: getUserId(req)
            })
        )
    );

    // List all a user's gear
    router.get(
        "/",
        authentication,
        useHandlers((req: Request) =>
            runListQuery(
                queryWithCache,
                Gear,
                {
                    owner: getUserId(req)
                },
                undefined,
                resources.GEAR
            )(req)
        )
    );

    // Get gear by ID
    router.get(
        "/:id",
        authentication,
        useHandlers((req: Request) => Gear.get(req.params.id))
    );

    // Update gear
    router.put(
        "/:id",
        authentication,
        clearCache,
        useHandlers((req: Request) => Gear.update(req.params.id, req.body))
    );

    // Delete gear
    router.delete(
        "/:id",
        authentication,
        clearCache,
        useHandlers((req: Request) => Gear.delete(req.params.id))
    );

    return router;
};

export default gearRoutes;
