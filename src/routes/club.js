const express = require('express');
const router = express.Router();
const ClubModel = require('../models/club');
const middleware = require('../middleware/auth');
const routeBuilder = require('../helpers/routeBuilder');

// Create new club
router.post('/', middleware, async (req, res) => 
    routeBuilder(
        await ClubModel.create(
            {
                name: req.body.name,
                location: req.body.location,
                description: req.body.description,
                managers: req.body.managers,
                website: req.body.website
            }
        ), 
        res
    )
);

// List all clubs
router.get('/', middleware, async (req, res) => 
    routeBuilder(await ClubModel.find({}), res)
);

// Search for clubs
router.get('/search', middleware, async (req, res) => 
    routeBuilder(
        await ClubModel.find(
            {
                name: req.body.name,
                location: req.body.location
            }
        ),
        res
    )
);

// Get club by ID
router.get('/:id', middleware, async (req, res) => 
    routeBuilder(
        await ClubModel.findOne(
            {
                _id: req.params.id
            }
        ),
        res
    )
);

// Update club
router.put('/:id', middleware, async (req, res) => 
    routeBuilder(
        await ClubModel.findOneAndUpdate(
            {
                _id: req.params.id
            }
        ),
        res
    )
);

// Delete club
router.delete('/:id', middleware, async (req, res) => 
    routeBuilder(
        await ClubModel.findOneAndDelete(
            {
                _id: req.params.id,
            }
        ),
        res
    )
);

module.exports = router;
