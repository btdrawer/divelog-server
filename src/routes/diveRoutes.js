const express = require("express");
const router = express.Router();
const {
    UserModel,
    DiveModel
} = require("@btdrawer/divelog-server-utils").models;
const { authentication, clearCache } = require("../middleware");
const { getUserId } = require("../utils/authUtils");
const {
    getFieldsToReturn,
    populateFields,
    useHandlers
} = require("../utils/routeUtils");
const runListQuery = require("../utils/runListQuery");

// Create new dive
router.post(
    "/",
    authentication,
    clearCache,
    useHandlers(async req => {
        const userId = getUserId(req);
        const dive = await new DiveModel({
            timeIn: req.body.time_in,
            timeOut: req.body.time_out,
            bottomTime: req.body.bottom_time,
            safetyStopTime: req.body.safety_stop_time,
            maxDepth: req.body.max_depth,
            location: req.body.location,
            description: req.body.description,
            club: req.body.club_id,
            user: userId,
            buddies: req.body.buddies,
            gear: req.body.gear,
            public: req.body.is_public
        }).save();
        await UserModel.findByIdAndUpdate(userId, {
            $push: {
                dives: dive.id
            }
        });
        return dive;
    })
);

// List the authenticated user's dives
router.get(
    "/",
    authentication,
    useHandlers(req =>
        runListQuery({
            model: DiveModel,
            filter: req.query.user
                ? {
                      user: req.query.user,
                      public: true
                  }
                : {
                      user: getUserId(req)
                  },
            useCache: true
        })(req)
    )
);

// Get dive by ID
router.get(
    "/:id",
    authentication,
    useHandlers(req =>
        populateFields(
            () =>
                DiveModel.findById(
                    req.params.id,
                    getFieldsToReturn(req.query.fields)
                ),
            ["user", "buddies", "club", "gear"]
        )
    )
);

// Update dive
router.put(
    "/:id",
    authentication,
    clearCache,
    useHandlers(req =>
        DiveModel.findByIdAndUpdate(
            req.params.id,
            {
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
            },
            { new: true }
        )
    )
);

// Delete dive
router.delete(
    "/:id",
    authentication,
    clearCache,
    useHandlers(async req => {
        const dive = await DiveModel.findByIdAndDelete(req.params.id);
        await UserModel.findByIdAndUpdate(getUserId(req), {
            $pull: {
                dives: dive.id
            }
        });
        return dive;
    })
);

module.exports = router;
