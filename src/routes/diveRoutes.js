const express = require("express");
const router = express.Router();
const { getUserId } = require("../utils/authUtils");
const {
    UserModel,
    DiveModel
} = require("@btdrawer/divelog-server-utils").models;
const authentication = require("../middleware/authentication");
const clearCache = require("../middleware/cache/clearCache");
const routeBuilder = require("../utils/routeBuilder");

// Create new dive
router.post("/", authentication, clearCache, (req, res) =>
    routeBuilder.post({
        model: DiveModel,
        res,
        payload: {
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
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "dives",
                id: getUserId(req)
            }
        ]
    })
);

// List the authenticated user's dives
router.get("/", authentication, (req, res) => {
    const filter = {
        user: req.query.user || getUserId(req)
    };
    if (req.query.user) {
        filter.public = true;
    }

    routeBuilder.getAll({
        model: DiveModel,
        req,
        res,
        filter,
        useCache: true
    });
});

// Get dive by ID
router.get("/:id", authentication, (req, res) =>
    routeBuilder.getOne({
        model: DiveModel,
        req,
        res,
        filter: {
            _id: req.params.id
        },
        fieldsToPopulate: ["user", "buddies", "club", "gear"]
    })
);

// Update dive
router.put("/:id", authentication, clearCache, (req, res) =>
    routeBuilder.put({
        model: DiveModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
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
        }
    })
);

// Delete dive
router.delete("/:id", authentication, clearCache, (req, res) =>
    routeBuilder.delete({
        model: DiveModel,
        res,
        filter: {
            _id: req.params.id
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "dives",
                id: getUserId(req)
            }
        ]
    })
);

module.exports = router;
