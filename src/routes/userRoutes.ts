import express from "express";
import { UserDocument, User, errorCodes } from "@btdrawer/divelog-server-core";
import {
    signJwt,
    getUserId,
    getFieldsToReturn,
    useHandlers,
    runListQuery,
} from "../utils";

const router = express.Router();

const getUserAuthPayload = async (userFunc: any): Promise<{
    data: UserDocument, 
    token: string
}> => {
    const user = await userFunc.apply();
    const token = signJwt(user._id);
    return {
        data: user,
        token
    };
};

const userRoutes = (middleware: any, queryWithCache: any) => {
    const { authentication } = middleware;

    // Create new user
    router.post(
        "/",
        useHandlers((req: any) =>
            getUserAuthPayload(() =>
                User.create({
                    name: req.body.name,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                })
            )
        )
    );

    // Login
    router.post(
        "/login",
        useHandlers((req: any) =>
            getUserAuthPayload(() =>
                User.login(req.body.username, req.body.password)
            )
        )
    );

    // Send or accept friend request
    router.post(
        "/friend/:id",
        authentication,
        useHandlers(async (req: any) => {
            let myId = await getUserId(req);
            let friendId = req.params.id;
            if (myId === friendId) {
                throw new Error(errorCodes.CANNOT_ADD_YOURSELF);
            }
            const checkInbox = await User.get(myId);
            let user;
            if (checkInbox?.friendRequests.sent.includes(friendId)) {
                throw new Error(errorCodes.FRIEND_REQUEST_ALREADY_SENT);
            } else if (checkInbox?.friends.includes(friendId)) {
                throw new Error(errorCodes.ALREADY_FRIENDS);
            } else if (checkInbox?.friendRequests.inbox.includes(friendId)) {
                // Accept request
                user = await User.accept(myId, friendId);
            } else {
                // Send request
                user = await User.add(myId, friendId);
            }
            return user;
        })
    );

    // Unfriend
    router.delete(
        "/friend/:id",
        authentication,
        useHandlers((req: any) => User.unfriend(getUserId(req), req.params.id))
    );

    // List all users
    router.get(
        "/",
        authentication,
        useHandlers(
            runListQuery(queryWithCache, User, undefined, ["name", "username"])
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
        useHandlers((req: any) =>
            User.get(
                getUserId(req),
                getFieldsToReturn(req.query.fields, [
                    "name",
                    "username",
                    "friends",
                    "friend_requests",
                    "dives",
                    "clubs",
                    "gear"
                ]),
                userFieldsToPopulate
            )
        )
    );

    // Get user by ID
    router.get(
        "/:id",
        authentication,
        useHandlers((req: any) =>
            User.get(
                req.params.id,
                getFieldsToReturn(req.query.fields, ["name", "username"]),
                userFieldsToPopulate
            )
        )
    );

    // Update user details
    router.put(
        "/",
        authentication,
        useHandlers((req: any) => User.update(getUserId(req), req.body))
    );

    // Delete user
    router.delete(
        "/",
        authentication,
        useHandlers((req: any) => User.delete(getUserId(req)))
    );

    return router;
};

export default userRoutes;
