const express = require("express");
const router = express.Router();
const GearModel = require("../models/gear");
const middleware = require("../authentication/middleware");
const { getUserID } = require("../authentication/authTools");
const routeBuilder = require("../routeBuilder");

// Create gear
router.post("/", middleware, (req, res) =>
  routeBuilder.post(GearModel, res, {
    brand: req.body.brand,
    name: req.body.name,
    type: req.body.type,
    owner: getUserID(req)
  })
);

// List all gear for signed-in user
router.get("/", middleware, (req, res) =>
  routeBuilder.getAll(GearModel, res, {
    owner: getUserID(req)
  })
);

// Get gear by ID
router.get("/:id", middleware, (req, res) =>
  routeBuilder.getOne(GearModel, res, {
    _id: req.params.id
  })
);

// Update gear
router.put("/:id", middleware, (req, res) =>
  routeBuilder.put(
    GearModel,
    res,
    {
      _id: req.params.id
    },
    req.body
  )
);

// Delete gear
router.delete("/:id", middleware, (req, res) =>
  routeBuilder.delete(GearModel, res, {
    _id: req.params.id
  })
);

module.exports = router;
