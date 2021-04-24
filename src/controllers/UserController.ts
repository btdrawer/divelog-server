import { Request } from "express";
import { Services, User, UserDocument, errorCodes, getResourceId } from "@btdrawer/divelog-server-core";
import Controller, { ListResult } from "./Controller";
import {
    alreadyFriendsHttpError,
    cannotAddYourselfHttpError,
    friendRequestAlreadySentHttpError,
    notFoundHttpError
} from '../HttpError';

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

    private authenticatedUserFieldsToReturn = [
        "name",
        "username",
        "friends",
        "friend_requests",
        "dives",
        "clubs",
        "gear"
    ];

    private basicUserFieldsToReturn = [
        "name",
        "username"
    ]

    private getAuthPayload(user: UserDocument): AuthPayload {
        const token = this.signJwt(user._id);
        return {
            data: user,
            token
        };
    }

    createUser = async (req: Request): Promise<AuthPayload> => {
        const user = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        return this.getAuthPayload(user);
    }

    login = async (req: Request): Promise<AuthPayload> => {
        const user = await User.login(req.body.username, req.body.password);
        if (!user) {
            throw notFoundHttpError;
        }
        return this.getAuthPayload(user);
    }

    listUsers = async (req: Request): Promise<ListResult> => {
        return this.runListQuery(
            req,
            User, 
            undefined, 
            this.basicUserFieldsToReturn
        )
    }

    getMe = async (req: Request): Promise<UserDocument | null> => {
        return User.get(
            this.getUserId(req),
            Controller.getFieldsToReturn(
                <string>req.query.fields,
                this.authenticatedUserFieldsToReturn
            ),
            this.userFieldsToPopulate
        )
    }

    getUser = async (req: Request): Promise<UserDocument | null> => {
        return User.get(
            req.params.id,
            Controller.getFieldsToReturn(
                <string>req.query.fields, 
                this.basicUserFieldsToReturn
            ),
            this.userFieldsToPopulate
        )
    }

    updateUser = async (req: Request): Promise<UserDocument | null> => {
        return User.update(this.getUserId(req), req.body);
    }

    private validateHasSentFriendRequest = (inbox: UserDocument | null, friendId: string): void => {
        const hasSentFriendRequest = inbox?.friendRequests.sent.some(
            (friend: UserDocument | string) => getResourceId(friend) === friendId
        );
        if (hasSentFriendRequest) {
            throw friendRequestAlreadySentHttpError;
        }
    }

    private validateIsFriend = (inbox: UserDocument | null, friendId: string): void => {
        const isFriend = inbox?.friends.some(
            (friend: UserDocument | string) => getResourceId(friend) === friendId
        );
        if (isFriend) {
            throw alreadyFriendsHttpError;
        }
    }

    sendOrAcceptFriendRequest = async (req: Request): Promise<UserDocument | null> => {
        let myId = this.getUserId(req);
        let friendId = req.params.id;
        if (myId === friendId) {
            throw cannotAddYourselfHttpError;
        }
        const inbox = await User.get(myId);
        this.validateHasSentFriendRequest(inbox, friendId);
        this.validateIsFriend(inbox, friendId);
        const inInbox = inbox?.friendRequests.inbox.some(
            (friend: UserDocument | string) => getResourceId(friend) === friendId
        );
        return inInbox ? 
            User.accept(myId, friendId) : 
            User.add(myId, friendId);
    }

    removeFriend = async (req: Request): Promise<UserDocument | null> => {
        return User.unfriend(this.getUserId(req), req.params.id)
    }

    deleteUser = (req: Request): Promise<UserDocument | null> => {
        return User.delete(this.getUserId(req))
    }
}

export default UserController;
