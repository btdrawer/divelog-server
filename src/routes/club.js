const express = require('express');
const router = express.Router();
const ClubModel = require('../models/club');
const middleware = require('../middleware/auth');
const getAuthData = require('../middleware/getAuthData');
const handleSuccess = require('../handlers/handleSuccess');
const handleError = require('../handlers/handleError');

// Create new club
router.post('/', middleware, async (req, res) => {
    try {
        const club = await new ClubModel({
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            managers: [getAuthData(req).data._id],
            website: req.body.website
        });

        await club.save();

        handleSuccess(res, club, 'POST');
    } catch (err) {
        handleError(res, err);
    }
});

// List all clubs
router.get('/', middleware, async (req, res) => {
    try {
        let clubs;

        if (res.body) {
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
router.get('/:id', middleware, async (req, res) => {
    try {
        const club = await ClubModel.findOne({
            _id: req.params.id
        });

        handleSuccess(res, club, 'GET');
    } catch (err) {
        handleError(res, err);
    }
});

// Update club
router.put('/:id', middleware, async (req, res) => {
    try {
        const club = await ClubModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body,
        {new: true});

        handleSuccess(res, club, 'PUT');
    } catch (err) {
        handleError(res, err);
    }
});

// Delete club
router.delete('/:id', middleware, async (req, res) => {
    try {
        const club = await ClubModel.findOneAndDelete({
            _id: req.params.id,
        });

        handleSuccess(res, club, 'DELETE');
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;
