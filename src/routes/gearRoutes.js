const express = require("express");
const router = express.Router();
const {
    UserModel,
    GearModel
} = require("@btdrawer/divelog-server-utils").models;
const { getUserId } = require("../utils/authUtils");
const { authentication, clearCache } = require("../middleware");
const { populateFields, useHandlers } = require("../utils/routeUtils");
const runListQuery = require("../utils/runListQuery");

// Create gear
router.post(
    "/",
    authentication,
    clearCache,
    useHandlers(async req => {
        const ownerId = getUserId(req);
        const gear = await new GearModel({
            brand: req.body.brand,
            name: req.body.name,
            type: req.body.type,
            owner: ownerId
        });
        await UserModel.findByIdAndUpdate(ownerId, {
            $push: {
                gear: gear.id
            }
        });
        return gear;
    })
);

// List all a user's gear
router.get(
    "/",
    authentication,
    useHandlers(req =>
        runListQuery({
            model: GearModel,
            filter: {
                owner: getUserId(req)
            }
        })(req)
    )
);

// Get gear by ID
router.get(
    "/:id",
    authentication,
    useHandlers(req =>
        populateFields(() => GearModel.findById(req.params.id), ["owner"])
    )
);

// Update gear
router.put(
    "/:id",
    authentication,
    clearCache,
    useHandlers(req =>
        GearModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    )
);

// Delete gear
router.delete(
    "/:id",
    authentication,
    clearCache,
    useHandlers(async req => {
        const gear = await GearModel.findByIdAndDelete(req.params.id);
        await UserModel.findByIdAndUpdate(getUserId(req), {
            $pull: {
                gear: gear.id
            }
        });
        return gear;
    })
);

module.exports = router;
