import { Request } from "express";
import { Services, User, UserDocument, errorCodes, getResourceId } from "@btdrawer/divelog-server-core";
import Controller from "./Controller";
import { signJwt, getUserId, runListQuery, ListResult, getFieldsToReturn } from "../utils";

export interface AuthPayload {
    data: UserDocument;
    token: string;
}

class UserController extends Controller {
    constructor(services: Services) {
        super(services);
    }

    private userFieldsToPopulate = [
        "dives",
        "clubs.manager",
        "clubs.member",
        "gear",
        "friends",
        "friendRequests.inbox",
        "friendRequests.sent"
    ];

    private getAuthPayload(user: UserDocument): AuthPayload {
        const token = signJwt(user._id);
        return {
            data: user,
            token
        };
    }

    async createUser(req: Request): Promise<AuthPayload> {
        const user = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        return this.getAuthPayload(user);
    }

    async login(req: Request): Promise<AuthPayload> {
        const user = await User.login(req.body.username, req.body.password);
        if (!user) {
            throw new Error("User not found.");
        }
        return this.getAuthPayload(user);
    }

    listUsers = async (req: Request): Promise<ListResult> => {
        return runListQuery(req, this.services.cache.queryWithCache, User, undefined, ["name", "username"])
    }

    async getMe(req: Request): Promise<UserDocument | null> {
        return User.get(
            getUserId(req),
            getFieldsToReturn(<string>req.query.fields, [
                "name",
                "username",
                "friends",
                "friend_requests",
                "dives",
                "clubs",
                "gear"
            ]),
            this.userFieldsToPopulate
        )
    }

    async getUser(req: Request): Promise<UserDocument | null> {
        return User.get(
            req.params.id,
            getFieldsToReturn(<string>req.query.fields, ["name", "username"]),
            this.userFieldsToPopulate
        )
    }

    async updateUser(req: Request): Promise<UserDocument | null> {
        return User.update(getUserId(req), req.body);
    }

    async sendOrAcceptFriendRequest(req: Request): Promise<UserDocument | null> {
        let myId = getUserId(req);
        let friendId = req.params.id;
        if (myId === friendId) {
            throw new Error(errorCodes.CANNOT_ADD_YOURSELF);
        }
        const checkInbox = await User.get(myId);
        const hasSentFriendRequest = checkInbox?.friendRequests.sent.some(
            (friend: UserDocument | string) => getResourceId(friend) === friendId
        );
        const isFriend = checkInbox?.friends.some(
            (friend: UserDocument | string) => getResourceId(friend) === friendId
        );
        const inInbox = checkInbox?.friendRequests.inbox.some(
            (friend: UserDocument | string) => getResourceId(friend) === friendId
        );
        let user;
        if (hasSentFriendRequest) {
            throw new Error(errorCodes.FRIEND_REQUEST_ALREADY_SENT);
        } else if (isFriend) {
            throw new Error(errorCodes.ALREADY_FRIENDS);
        } else if (inInbox) {
            // Accept request
            user = await User.accept(myId, friendId);
        } else {
            // Send request
            user = await User.add(myId, friendId);
        }
        return user;
    }

    async removeFriend(req: Request): Promise<UserDocument | null> {
        return User.unfriend(getUserId(req), req.params.id)
    }

    async deleteUser(req: Request): Promise<UserDocument | null> {
        return User.delete(getUserId(req))
    }
}

export default UserController;
