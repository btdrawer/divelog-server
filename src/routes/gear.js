const express = require('express');
const router = express.Router();
const GearModel = require('../models/gear');
const middleware = require('../middleware/auth');
const routeBuilder = require('../helpers/routeBuilder');
const getAuthData = require('../middleware/getAuthData');

// Create gear
router.post('/', middleware, async (req, res) => 
    routeBuilder(
        await GearModel.create({
            brand: req.body.brand,
            name: req.body.name,
            type: req.body.type,
            owner: getAuthData(req).data._id
        }),
        res,
        'POST'
    )
);

// List all gear for signed-in user
router.get('/', middleware, async (req, res) =>
    routeBuilder(
        await GearModel.find({
            owner: getAuthData(req).data._id
        }),
        res,
        'GET'
    )
);

// Get gear by ID
router.get('/:id', middleware, async (req, res) =>
    routeBuilder(
        await GearModel.findOne({
            _id: req.params.id
        }),
        res,
        'GET'
    )
);

// Update gear
router.put('/:id', middleware, async (req, res) =>
    routeBuilder(
        await GearModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.new_properties,
        {new: true}),
        res,
        'PUT'
    )
);

// Delete gear
router.delete('/:id', middleware, async (req, res) =>
    routeBuilder(
        await GearModel.findOneAndDelete({
            _id: req.params.id
        }),
        res,
        'DELETE'
    )
);

module.exports = router;