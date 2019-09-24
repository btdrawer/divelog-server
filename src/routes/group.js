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
        const myId = getAuthData(req).data._id;
        req.body.participants.push(myId);

        const group = await new GroupModel({
            name: req.body.group_name,
            participants: req.body.participants,
            messages: [{
                text: req.body.text,
                sender: myId
            }]
        });

        await group.save();
    
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
                    sender: getAuthData(req).data._id,
                    sent: new Date().getMilliseconds()
                }
            }
        }, {new: true});

        handleSuccess(res, group, 'POST');
    } catch (err) {
        handleError(res, err);
    }
});

// List groups the user participates in
router.get('/', middleware, async (req, res) => {
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
router.get('/:id', middleware, async (req, res) => {
    try {
        const group = await GroupModel.find({
            _id: req.params.id
        });

        handleSuccess(res, group, 'GET');
    } catch (err) {
        handleError(res, err);
    }
});

// Add member to group
router.post('/:id/user/:userId', middleware, async (req, res) => {
    try {
        const group = await GroupModel.findOne({
            _id: req.params.id
        });

        await group.addUser(req.params.userId);

        handleSuccess(res, group, 'POST');
    } catch (err) {
        handleError(res, err);
    }
});

// Leave gronp
router.delete('/:id/leave', middleware, async (req, res) => {
    try {
        const group = await GroupModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            '$pull': {
                participants: getAuthData(req).data._id
            }
        }, {new: true});

        await group.save();

        handleSuccess(res, group, 'DELETE');
    } catch (err) {
        handleError(res, err);
    }
})

module.exports = router;