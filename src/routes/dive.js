const express = require('express');
const router = express.Router();
const DiveModel = require('../models/dive');
const middleware = require('../authentication/middleware');
const getUserID = require('../authentication/helpers/getUserID');
const routeBuilder = require('../helpers/routeBuilder');

// Create new dive
router.post('/', middleware, (req, res) => 
    routeBuilder.post(DiveModel, res, {
        time_in: res.body.time_in,
        time_out: res.body.time_out,
        bottom_time: res.body.bottom_time,
        safety_stop_time: res.body.safety_stop_time,
        max_depth: res.body.max_depth,
        location: res.body.location,
        description: res.body.description,
        club: res.body.club_id,
        user: getUserID(req),
        buddies: res.body.buddies,
        gear: res.body.gear,
        public: res.body.is_public
    })
);

// List all a user's dives
router.get('/', middleware, async (req, res) => 
    routeBuilder.getAll(DiveModel, res, {
        user: getUserID(req)
    })
);

// Get dive by ID
router.get('/:id', middleware, (req, res) => 
    routeBuilder.getOne(DiveModel, res, {
        _id: req.params.id
    })
);

// Update dive
router.put('/:id', middleware, (req, res) => 
    routeBuilder.put(DiveModel, res, {
        _id: req.params.id
    }, req.body)
);

// Delete dive
router.delete('/:id', middleware, (req, res) => 
    routeBuilder.delete(DiveModel, res, {
        _id: req.params.id
    })
);

module.exports = router;
