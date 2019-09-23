const express = require('express');
const router = express.Router();
const GearModel = require('../models/gear');
const middleware = require('../middleware/auth');
const getAuthData = require('../middleware/getAuthData');
const handleSuccess = require('../handlers/handleSuccess');
const handleErrror = require('../handlers/handleError');

// Create gear
router.post('/', middleware, async (req, res) => {
    try {
        const gear = await new GearModel({
            brand: req.body.brand,
            name: req.body.name,
            type: req.body.type,
            owner: getAuthData(req).data._id
        });

        await gear.save();

        handleSuccess(res, gear, 'POST');
    } catch (err) {
        handleErrror(res, err);
    }
});

// List all gear for signed-in user
router.get('/', middleware, async (req, res) => {
    try {
        const gear = await GearModel.find({
            owner: getAuthData(req).data._id
        });

        handleSuccess(res, gear, 'GET');
    } catch (err) {
        handleErrror(res, err);
    }
});

// Get gear by ID
router.get('/:id', middleware, async (req, res) => {
    try {
        const gear = await GearModel.findOne({
            _id: req.params.id
        });

        handleSuccess(res, gear, 'GET');
    } catch (err) {
        handleErrror(res, err);
    }
});

// Update gear
router.put('/:id', middleware, async (req, res) => {
    try {
        const gear = await GearModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.new_properties,
        {new: true});

        handleSuccess(res, gear, 'PUT');
    } catch (err) {
        handleErrror(res, err);
    }
});

// Delete gear
router.delete('/:id', middleware, async (req, res) => {
    try {
        const gear = await GearModel.findOneAndDelete({
            _id: req.params.id
        });

        handleSuccess(res, gear, 'DELETE');
    } catch (err) {
        handleErrror(res, err);
    }
});

module.exports = router;