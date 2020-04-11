const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const middleware = require("../authentication/middleware");
const { getUserID } = require("../authentication/authUtils");
const errorKeys = require("../constants/errorKeys");
const handleSuccess = require("../handlers/handleSuccess");
const handleError = require("../handlers/handleError");
const routeBuilder = require("../routeBuilder");

// Create new user
router.post("/", (req, res) =>
    routeBuilder.post({
        model: UserModel,
        res,
        payload: {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
    })
);

// Login
router.post("/login", async (req, res) =>
    routeBuilder.generic(
        UserModel,
        "authenticate",
        res,
        "POST",
        req.body.username,
        req.body.password
    )
);

// Send or accept friend request
router.post("/friend/:id", middleware, async (req, res) => {
    try {
        let myId = await getUserID(req);
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
router.delete("/friend/:id", middleware, (req, res) =>
    routeBuilder.generic(
        UserModel,
        "unfriend",
        res,
        "DELETE",
        getUserID(req),
        req.params.id
    )
);

// List all users
router.get("/", middleware, (req, res) =>
    routeBuilder.getAll({
        model: UserModel,
        req,
        res,
        allowedFields: ["name", "username"]
    })
);

// Get user by ID
router.get("/:id", middleware, (req, res) => {
    const isMe = req.params.id === "me";
    const id = isMe ? getUserID(req) : req.params.id;
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
router.put("/", middleware, (req, res) =>
    routeBuilder.put({
        model: UserModel,
        res,
        filter: {
            _id: getUserID(req)
        },
        payload: req.body
    })
);

// Delete user
router.delete("/", middleware, (req, res) =>
    routeBuilder.delete({
        model: UserModel,
        res,
        filter: {
            _id: getUserID(req)
        }
    })
);

module.exports = router;
