const express = require("express");
const router = express.Router();
const ClubModel = require("../models/club");
const middleware = require("../authentication/middleware");
const { getUserID } = require("../authentication/authTools");
const routeBuilder = require("../routeBuilder");

// Create new club
router.post("/", middleware, (req, res) =>
  routeBuilder.post(ClubModel, res, {
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    managers: [getUserID(req)],
    website: req.body.website
  })
);

// List all clubs
router.get("/", middleware, (req, res) => {
  if (Object.keys(req.body).length > 0) {
    let query = {};
    if (req.body.name) query.name = req.body.name;
    if (req.body.location) query.location = req.body.location;

    routeBuilder.getAll(ClubModel, res, query);
  } else {
    routeBuilder.getAll(ClubModel, res, {});
  }
});

// Get club by ID
router.get("/:id", middleware, (req, res) =>
  routeBuilder.getOne(ClubModel, res, {
    _id: req.params.id
  })
);

// Update club
router.put("/:id", middleware, (req, res) =>
  routeBuilder.put(
    ClubModel,
    res,
    {
      _id: req.params.id
    },
    {
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      website: req.body.website
    }
  )
);

// Add manager
router.post("/:id/manager/:managerId", middleware, (req, res) =>
  routeBuilder.put(
    ClubModel,
    res,
    {
      _id: req.params.id
    },
    {
      $push: {
        managers: req.params.managerId
      }
    }
  )
);

// Add manager
router.delete("/:id/manager/:managerId", middleware, (req, res) =>
  routeBuilder.put(
    ClubModel,
    res,
    {
      _id: req.params.id
    },
    {
      $pull: {
        managers: req.params.managerId
      }
    }
  )
);

// Delete club
router.delete("/:id", middleware, (req, res) =>
  routeBuilder.delete(ClubModel, res, {
    _id: req.params.id
  })
);

module.exports = router;
