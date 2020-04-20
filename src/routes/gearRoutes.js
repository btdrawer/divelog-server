const express = require("express");
const router = express.Router();

const UserModel = require("../models/UserModel");
const GearModel = require("../models/GearModel");

const authentication = require("../middleware/authentication");
const clearCache = require("../middleware/cache/clearCache");

const { getUserId } = require("../utils/authUtils");
const routeBuilder = require("../utils/routeBuilder");

// Create gear
router.post("/", authentication, clearCache, async (req, res) => {
    const ownerId = getUserId(req);
    await routeBuilder.post({
        model: GearModel,
        res,
        payload: {
            brand: req.body.brand,
            name: req.body.name,
            type: req.body.type,
            owner: ownerId
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "gear",
                id: ownerId
            }
        ]
    });
});

// List all a user's gear
router.get("/", authentication, async (req, res) =>
    routeBuilder.getAll({
        model: GearModel,
        req,
        res,
        filter: {
            owner: getUserId(req)
        },
        useCache: true
    })
);

// Get gear by ID
router.get("/:id", authentication, async (req, res) =>
    routeBuilder.getOne({
        model: GearModel,
        req,
        res,
        filter: {
            _id: req.params.id
        },
        fieldsToPopulate: ["owner"]
    })
);

// Update gear
router.put("/:id", authentication, clearCache, (req, res) =>
    routeBuilder.put({
        model: GearModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: req.body
    })
);

// Delete gear
router.delete("/:id", authentication, clearCache, (req, res) =>
    routeBuilder.delete({
        model: GearModel,
        res,
        filter: {
            _id: req.params.id
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "gear",
                id: getUserId(req)
            }
        ]
    })
);

module.exports = router;
