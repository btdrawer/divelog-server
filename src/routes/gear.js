const express = require("express");
const router = express.Router();
const GearModel = require("../models/gear");
const middleware = require("../authentication/middleware");
const { getUserID } = require("../authentication/authTools");
const routeBuilder = require("../routeBuilder");

// Create gear
router.post("/", middleware, (req, res) =>
    routeBuilder.post({
        model: GearModel,
        res,
        payload: {
            brand: req.body.brand,
            name: req.body.name,
            type: req.body.type,
            owner: getUserID(req)
        }
    })
);

// List all a user's gear
router.get("/", middleware, async (req, res) =>
    routeBuilder.getAll({
        model: GearModel,
        req,
        res,
        filter: {
            owner: getUserID(req)
        }
    })
);

// Get gear by ID
router.get("/:id", middleware, async (req, res) =>
    routeBuilder.getOne({
        model: GearModel,
        req,
        res,
        filter: {
            _id: req.params.id
        }
    })
);

// Update gear
router.put("/:id", middleware, (req, res) =>
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
router.delete("/:id", middleware, (req, res) =>
    routeBuilder.delete({
        model: GearModel,
        res,
        filter: {
            _id: req.params.id
        }
    })
);

module.exports = router;
