const express = require("express");
const router = express.Router();
const { UserModel } = require("@btdrawer/divelog-server-utils").models;
const { getUserId, signJwt } = require("../utils/authUtils");
const {
    getFieldsToReturn,
    populateFields,
    useHandlers
} = require("../utils/routeUtils");
const runListQuery = require("../utils/runListQuery");
const errorCodes = require("../constants/errorCodes");

const getUserAuthPayload = async userFunc => {
    const user = await userFunc.apply();
    const token = signJwt(user._id);
    return {
        data: user,
        token
    };
};

module.exports = (middleware, cacheUtils) => {
    console.log(middleware);
    const { authentication } = middleware;

    // Create new user
    router.post(
        "/",
        useHandlers(req =>
            getUserAuthPayload(() =>
                new UserModel({
                    name: req.body.name,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                }).save()
            )
        )
    );

    // Login
    router.post(
        "/login",
        useHandlers(req =>
            getUserAuthPayload(() =>
                UserModel.authenticate(req.body.username, req.body.password)
            )
        )
    );

    // Send or accept friend request
    router.post(
        "/friend/:id",
        authentication,
        useHandlers(async req => {
            let myId = await getUserId(req);
            let friendId = req.params.id;

            if (myId === friendId) {
                throw new Error(errorCodes.CANNOT_ADD_YOURSELF);
            }

            const checkInbox = await UserModel.findOne(
                {
                    _id: myId
                },
                ["friendRequests", "friends"]
            );

            let user;

            if (checkInbox.friendRequests.sent.includes(friendId)) {
                throw new Error(errorCodes.FRIEND_REQUEST_ALREADY_SENT);
            } else if (checkInbox.friends.includes(friendId)) {
                throw new Error(errorCodes.ALREADY_FRIENDS);
            } else if (checkInbox.friendRequests.inbox.includes(friendId)) {
                // Accept request
                user = await UserModel.accept(myId, friendId);
            } else {
                // Send request
                user = await UserModel.add(myId, friendId);
            }

            return user;
        })
    );

    // Unfriend
    router.delete(
        "/friend/:id",
        authentication,
        useHandlers(req => UserModel.unfriend(getUserId(req), req.params.id))
    );

    // List all users
    router.get(
        "/",
        authentication,
        useHandlers(req =>
            runListQuery({
                model: UserModel,
                allowedFields: ["name", "username"],
                cacheUtils
            })(req)
        )
    );

    const userFieldsToPopulate = [
        "dives",
        "clubs.manager",
        "clubs.member",
        "gear",
        "friends",
        "friendRequests.inbox",
        "friendRequests.sent"
    ];

    // Get authenticated user
    router.get(
        "/me",
        authentication,
        useHandlers(req =>
            populateFields(
                () =>
                    UserModel.findById(
                        getUserId(req),
                        getFieldsToReturn(req.query.fields, [
                            "name",
                            "username",
                            "friends",
                            "friend_requests",
                            "dives",
                            "clubs",
                            "gear"
                        ])
                    ),
                userFieldsToPopulate
            )
        )
    );

    // Get user by ID
    router.get(
        "/:id",
        authentication,
        useHandlers(req =>
            populateFields(
                () =>
                    UserModel.findById(
                        req.params.id,
                        getFieldsToReturn(req.query.fields, [
                            "name",
                            "username"
                        ])
                    ),
                userFieldsToPopulate
            )
        )
    );

    // Update user details
    router.put(
        "/",
        authentication,
        useHandlers(req =>
            UserModel.findByIdAndUpdate(getUserId(req), req.body, { new: true })
        )
    );

    // Delete user
    router.delete(
        "/",
        authentication,
        useHandlers(req => UserModel.findByIdAndDelete(getUserId(req)))
    );

    return router;
};
