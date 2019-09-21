const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const middleware = require('../middleware/auth');
const routeBuilder = require('../helpers/routeBuilder');

// Create new user
router.post('/', async (req, res) => {
    try {
        const user = await new UserModel({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
        });

        await user.save();

        const token = await user.generateAuthToken();

        res.status(200).send({
            user, token
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await UserModel.authenticate(
            req.body.username, 
            req.body.password
        );

        const token = await user.generateAuthToken();

        res.status(200).send({
            user, token
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

// List all users
router.get('/', middleware, async (req, res) => {
    routeBuilder(
        await UserModel.find({}),
        res
    )
});

// Get user by ID
router.get('/:id', middleware, async (req, res) => 
    routeBuilder(
        await UserModel.findOne({
            _id: req.params.id
        }),
        res
    )
);

// Update user details
router.put('/:id', middleware, async (req, res) => 
    routeBuilder(
        await UserModel.updateOne({
            _id: req.params.id
        }, req.body.updated_fields),
        res
    )
);

// Delete user
router.delete('/:id', middleware, async (req, res) => 
    routeBuilder(
        await UserModel.deleteOne({
            _id: req.params.id
        }),
        res
    )
);

module.exports = router;
