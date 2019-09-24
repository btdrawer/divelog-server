const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const middleware = require('../middleware/auth');
const getAuthData = require('../middleware/getAuthData');
const handleSuccess = require('../handlers/handleSuccess');
const handleError = require('../handlers/handleError');

// Create new user
router.post('/', async (req, res) => {
    try {
        const user = await new UserModel({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
        });

        await user.save();

        handleSuccess(res, user, 'POST');
    } catch (err) {
        handleError(res, err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await UserModel.authenticate(
            req.body.username, 
            req.body.password
        );

        handleSuccess(res, user, 'POST');
    } catch (err) {
        handleError(res, err);
    }
});

// Add friend
router.post('/friend/:id', async (req, res) => {
    try {
        let myId = await getAuthData(req).data._id;

        const user = await UserModel.findOneAndUpdate({
            _id: myId
        }, {
            '$push': {
                friends: {
                    user: req.params.id,
                    accepted: false
                }
            }
        }, {new: true});

        await UserModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            '$push': {
                friend_requests: {
                    user: myId
                }
            }
        })

        handleSuccess(res, user, 'POST');
    } catch (err) {
        handleError(res, err);
    }
});

// List all users
router.get('/', middleware, async (req, res) => {
    try {
        const users = await UserModel.find({}, {
            name: 1,
            username: 1
        });

        handleSuccess(res, users, 'GET');
    } catch (err) {
        handleError(res, err);
    }
});

// Get user by ID
router.get('/:id', middleware, async (req, res) => {
    try {
        const user = await UserModel.findOne({
            _id: req.params.id
        }, {
            name: 1,
            username: 1
        });

        handleSuccess(res, user, 'GET');
    } catch (err) {
        handleError(res, err);
    }
});

// Update user details
router.put('/', middleware, async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate({
            _id: getAuthData(req).data._id
        }, req.body.new_properties,
        {new: true});

        handleSuccess(res, user, 'PUT');
    } catch (err) {
        handleError(res, err);
    }
});

// Delete user
router.delete('/', middleware, async (req, res) => {
    try {
        const user = await UserModel.findOneAndDelete({
            _id: getAuthData(req).data._id
        });

        handleSuccess(res, user, 'DELETE');
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;
