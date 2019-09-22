const express = require('express');
const router = express.Router();
const GroupModel = require('../models/group');
const middleware = require('../middleware/auth');
const routeBuilder = require('../helpers/routeBuilder');

// Create new group and post first message
router.post('/group', middleware, async (req, res) => 
    routeBuilder(
        await GroupModel.create({
            name: req.body.group_name,
            participants: req.body.participants,
            messages: [{
                text: req.body.text,
                sender: req.body.sender_id
            }]
        }),
        res,
        'POST'
    )
);

// Post new message
router.post('/:groupId', middleware, async (req, res) =>
    routeBuilder(
        await GroupModel.findOneAndUpdate({
            _id: req.params.groupId
        },
        {
            '$push': {
                messages: {
                    text: req.body.text,
                    sender: req.body.sender_id
                }
            }
        }),
        res,
        'POST'
    )
);

// List groups the user participates in
router.get('/', async (req, res) =>
    routeBuilder(
        await GroupModel.find({
            participants: req.body.user_id
        }),
        res,
        'GET'
    )
);

// Get group
router.get('/:groupId', async (req, res) =>
    routeBuilder(
        await GroupModel.find({
            _id: req.params.groupId
        }),
        res,
        'GET'
    )
);

module.exports = router;