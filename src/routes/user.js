const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const middleware = require('../authentication/middleware');
const getUserID = require('../authentication/helpers/getUserID');
const handleSuccess = require('../handlers/handleSuccess');
const handleError = require('../handlers/handleError');
const routeBuilder = require('../helpers/routeBuilder');

// Create new user
router.post('/', (req, res) => 
    routeBuilder.post(UserModel, res, {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    })
);

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
        let myId = await getUserID(req);

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
router.get('/', middleware, (req, res) =>
    routeBuilder.getAll(UserModel, res, {},
        ['name', 'username']
    )
);

// Get user by ID
router.get('/:id', middleware, (req, res) =>
    routeBuilder.getOne(UserModel, res, {
        _id: req.params.id
    }, ['name', 'username'])
);

// Update user details
router.put('/', middleware, (req, res) =>
    routeBuilder.put(UserModel, res, {
        _id: getUserID(req)
    }, req.body)
);

// Delete user
router.delete('/', middleware, (req, res) =>
    routeBuilder.delete(UserModel, res, {
        _id: getUserID(req)
    })
);

module.exports = router;
