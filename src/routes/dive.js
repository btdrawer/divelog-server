const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const DiveModel = require("../models/DiveModel");
const middleware = require("../authentication/middleware");
const { getUserID } = require("../authentication/authUtils");
const routeBuilder = require("../routeBuilder");

// Create new dive
router.post("/", middleware, (req, res) =>
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
            user: getUserID(req),
            buddies: req.body.buddies,
            gear: req.body.gear,
            public: req.body.is_public
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "dives",
                id: getUserID(req)
            }
        ]
    })
);

// List the authenticated user's dives
router.get("/", middleware, (req, res) => {
    const filter = {
        user: req.query.user || getUserID(req)
    };
    if (req.query.user) {
        filter.public = true;
    }

    routeBuilder.getAll({
        model: DiveModel,
        req,
        res,
        filter
    });
});

// Get dive by ID
router.get("/:id", middleware, (req, res) =>
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
router.put("/:id", middleware, (req, res) =>
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
router.delete("/:id", middleware, (req, res) =>
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
                id: getUserID(req)
            }
        ]
    })
);

module.exports = router;
