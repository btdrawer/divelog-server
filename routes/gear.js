const express = require('express');
const router = express.Router();
const GearModel = require('../models/gear');
const middleware = require('../middleware/auth');
const routeBuilder = require('../routeBuilder');

// Create gear
router.post('/', middleware, async (req, res) => 
    routeBuilder(
        await GearModel.create(
            {
                brand: req.body.brand,
                name: req.body.name,
                type: req.body.type,
                ownerId: req.body.ownerId
            }
        ),
        res
    )
);

// List all gear for signed-in user
router.get('/', middleware, async (req, res) =>
    routeBuilder(
        await GearModel.find(
            {
                ownerId: req.body.ownerId
            }
        ),
        res
    )
);

// Get gear by ID
router.get('/:id', middleware, async (req, res) =>
    routeBuilder(
        await GearModel.findOne(
            {
                _id: req.params.id
            }
        ),
        res
    )
);

// Update gear
router.put('/:id', middleware, async (req, res) =>
    routeBuilder(
        await GearModel.findOneAndUpdate(
            {
                _id: req.params.id
            },
            req.body.new_properties
        ),
        res
    )
);

// Delete gear
router.delete('/:id', middleware, async (req, res) =>
    routeBuilder(
        await GearModel.findOneAndDelete(
            {
                _id: req.params.id
            }
        ),
        res
    )
);

module.exports = router;