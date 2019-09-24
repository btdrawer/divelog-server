const express = require('express');
const router = express.Router();
const GroupModel = require('../models/group');
const middleware = require('../middleware/auth');
const getAuthData = require('../middleware/getAuthData');
const handleSuccess = require('../handlers/handleSuccess');
const handleError = require('../handlers/handleError');

// Create new group and post first message
router.post('/', middleware, async (req, res) => {
    try {
        const group = await GroupModel.create({
            name: req.body.group_name,
            participants: req.body.participants,
            messages: [{
                text: req.body.text,
                sender: getAuthData(req).data._id
            }]
        });
    
        handleSuccess(res, group, 'POST');
    } catch (err) {
        handleError(res, err);
    }
});

// Post new message
router.post('/:id/message', middleware, async (req, res) => {
    try {
        const group = await GroupModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            '$push': {
                messages: {
                    text: req.body.text,
                    sender: getAuthData(req).data._id
                }
            }
        });

        handleSuccess(res, group, 'POST');
    } catch (err) {
        handleError(res, err);
    }
});

// List groups the user participates in
router.get('/', async (req, res) => {
    try {
        const groups = await GroupModel.find({
            participants: getAuthData(req).data._id
        });

        handleSuccess(res, groups, 'GET');
    } catch (err) {
        handleError(res, err);
    }
});

// Get group
router.get('/:id', async (req, res) => {
    try {
        const group = await GroupModel.find({
            _id: req.params.id
        });

        handleSuccess(res, group, 'GET');
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;