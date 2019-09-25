const express = require('express');
const router = express.Router();
const ClubModel = require('../models/club');
const middleware = require('../middleware/auth');
const getAuthData = require('../middleware/getAuthData');
const handleSuccess = require('../handlers/handleSuccess');
const handleError = require('../handlers/handleError');
const routeBuilder = require('../helpers/routeBuilder');

// Create new club
router.post('/', middleware, (req, res) => 
    routeBuilder.post(ClubModel, res, {
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        managers: [getAuthData(req).data._id],
        website: req.body.website
    })
);

// List all clubs
router.get('/', middleware, async (req, res) => {
    try {
        let clubs;

        if (req.body) {
            clubs = await ClubModel.find({
                name: req.body.name,
                location: req.body.location
            });
        } else {
            clubs = await ClubModel.find({});
        }

        handleSuccess(res, clubs, 'GET');
    } catch (err) {
        handleError(res, err);
    }
});

// Get club by ID
router.get('/:id', middleware, (req, res) => 
    routeBuilder.getOne(ClubModel, res, {
        _id: req.params.id
    })
);

// Update club
router.put('/:id', middleware, (req, res) => 
    routeBuilder.put(ClubModel, res, {
        _id: req.params.id
    }, req.body)
);

// Delete club
router.delete('/:id', middleware, (req, res) => 
    routeBuilder.delete(UserModel, res, {
        _id: req.params.id
    })
);

module.exports = router;
