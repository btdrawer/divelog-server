const express = require("express");
const router = express.Router();
const { UserModel } = require("@btdrawer/divelog-server-utils").models;
const { getUserId, signJwt } = require("../utils/authUtils");
const authentication = require("../middleware/authentication");
const routeBuilder = require("../utils/routeBuilder");
const errorKeys = require("../constants/errorKeys");
const handleSuccess = require("../handlers/handleSuccess");
const handleError = require("../handlers/handleError");

// Create new user
router.post("/", async (req, res) => {
    try {
        const user = new UserModel({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();
        const token = signJwt(user._id);
        const data = {
            data: user,
            token
        };
        handleSuccess(res, data, "POST");
    } catch (err) {
        handleError(res, err);
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await UserModel.authenticate(
            req.body.username,
            req.body.password
        );
        const token = signJwt(user._id);
        const data = {
            data: user,
            token
        };
        handleSuccess(res, data, "POST");
    } catch (err) {
        handleError(res, err);
    }
});

// Send or accept friend request
router.post("/friend/:id", authentication, async (req, res) => {
    try {
        let myId = await getUserId(req);
        let friendId = req.params.id;

        if (myId === friendId) {
            throw new Error(errorKeys.CANNOT_ADD_YOURSELF);
        }

        const checkInbox = await UserModel.findOne(
            {
                _id: myId
            },
            ["friend_requests", "friends"]
        );

        let user;

        if (checkInbox.friend_requests.sent.includes(friendId)) {
            throw new Error(errorKeys.FRIEND_REQUEST_ALREADY_SENT);
        } else if (checkInbox.friends.includes(friendId)) {
            throw new Error(errorKeys.ALREADY_FRIENDS);
        } else if (checkInbox.friend_requests.inbox.includes(friendId)) {
            // Accept request
            user = await UserModel.accept(myId, friendId);
        } else {
            // Send request
            user = await UserModel.add(myId, friendId);
        }

        handleSuccess(res, user, "POST");
    } catch (err) {
        handleError(res, err);
    }
});

// Unfriend
router.delete("/friend/:id", authentication, (req, res) =>
    routeBuilder.generic(
        UserModel,
        "unfriend",
        res,
        "DELETE",
        getUserId(req),
        req.params.id
    )
);

// List all users
router.get("/", authentication, (req, res) =>
    routeBuilder.getAll({
        model: UserModel,
        req,
        res,
        allowedFields: ["name", "username"]
    })
);

// Get user by ID
router.get("/:id", authentication, (req, res) => {
    const isMe = req.params.id === "me";
    const id = isMe ? getUserId(req) : req.params.id;
    const allowedFields = isMe
        ? [
              "name",
              "username",
              "friends",
              "friend_requests",
              "dives",
              "clubs",
              "gear"
          ]
        : ["name", "username"];
    const fieldsToPopulate = [
        "dives",
        "clubs.manager",
        "clubs.member",
        "gear",
        "friends",
        "friendRequests.inbox",
        "friendRequests.sent"
    ];

    routeBuilder.getOne({
        model: UserModel,
        req,
        res,
        query: {
            _id: id
        },
        allowedFields,
        fieldsToPopulate
    });
});

// Update user details
router.put("/", authentication, (req, res) =>
    routeBuilder.put({
        model: UserModel,
        res,
        filter: {
            _id: getUserId(req)
        },
        payload: req.body
    })
);

// Delete user
router.delete("/", authentication, (req, res) =>
    routeBuilder.delete({
        model: UserModel,
        res,
        filter: {
            _id: getUserId(req)
        }
    })
);

module.exports = router;
