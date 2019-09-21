const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const middleware = require('../middleware/auth');
const routeBuilder = require('../helpers/routeBuilder');

// Create new user
router.post('/', async (req, res) => {
    try {
        const user = new UserModel(
            {
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
            }
        );

        await user.save();

        const token = await user.generateAuthToken();

        res.status(200).send(
            {
                user, token
            }
        );
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

        res.status(200).send(
            {
                user, token
            }
        );
    } catch (err) {
        res.status(400).send(err);
    }
});

// List all users
router.get('/', middleware, async (req, res) => 
    routeBuilder(
        await UserModel.find({})
            .toArray((err, fields) => {
                if (err) throw err;

                fields.forEach(user => {
                    delete user.password;
                });
            }
        ),
        res
    )
);

// Get user by ID
router.get('/:id', middleware, async (req, res) => 
    routeBuilder(
        await UserModel.findOne(
            {
                _id: req.params.id
            }
        ),
        res
    )
);

// Update user details
router.put('/:id', middleware, async (req, res) => 
    routeBuilder(
        await UserModel.updateOne(
            {
                _id: req.params.id
            }
        ),
        res
    )
);

// Delete user
router.delete('/:id', middleware, async (req, res) => 
    routeBuilder(
        await UserModel.deleteOne(
            {
                _id: req.params.id
            }
        ),
        res
    )
);

module.exports = router;
