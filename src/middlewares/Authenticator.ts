import { Request, Response, NextFunction } from "express";
import {
    getResourceId,
    User,
    Dive,
    Club,
    Gear,
    Group,
    UserDocument
} from "@btdrawer/divelog-server-core";
import * as jwt from "jsonwebtoken";
import {
    invalidAuthHttpError,
    forbiddenHttpError,
    notFoundHttpError
} from '../HttpError';
import { RouterUrls } from "../App";

class Authenticator {
    private static getAuthData(req: Request): any {
        const header = req.header("Authorization");
        if (!header) {
            throw invalidAuthHttpError;
        }
        const token = header.replace("Bearer ", "");
        return jwt.verify(token, <string>process.env.JWT_KEY);
    }

    static getUserId(req: Request): string {
        return Authenticator.getAuthData(req).id;
    }

    static signJwt(id: string): string {
        return jwt.sign({ id }, <string>process.env.JWT_KEY, {
            expiresIn: "3h"
        });
    }

    private static async authenticateDive(req: Request, userId: string) {
        if (req.method !== "POST" && req.params.id) {
            const dive = await Dive.get(req.params.id);
            if (!dive) {
                throw notFoundHttpError;
            } else if (
                dive.user.toString() !== userId &&
                !(req.method === "GET" && dive.public)
            ) {
                throw forbiddenHttpError;
            }
        }
    }

    private static async authenticateClub(req: Request, userId: string) {
        if (req.method !== "POST" && req.params.id) {
            const club = await Club.get(req.params.id);
            if (!club) {
                throw notFoundHttpError;
            } else if (req.method === "PUT" || req.method === "DELETE") {
                const isManager = club.managers.some(
                    (manager: UserDocument | string) =>
                        getResourceId(manager) === userId
                );
                if (!isManager && req.url !== `/${req.params.id}/member`) {
                    throw forbiddenHttpError;
                }
            }
        }
    }

    private static async authenticateGear(req: Request, userId: string) {
        if (req.method !== "POST" && req.params.id) {
            const gear = await Gear.get(req.params.id);
            if (!gear) {
                throw notFoundHttpError;
            } else if (gear.owner.toString() !== userId) {
                throw forbiddenHttpError;
            }
        }
    }

    private static async authenticateGroup(req: Request, userId: string) {
        if (req.params.id) {
            const group = await Group.get(req.params.id);
            if (!group) {
                throw notFoundHttpError;
            }
            const isParticipant = group.participants.some(
                (participant: UserDocument | string) =>
                    getResourceId(participant) === userId
            );
            if (!isParticipant) {
                throw forbiddenHttpError;
            }
        }
    }

    static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Authenticator.getUserId(req);
            const user = await User.get(userId);
            if (!user) {
                throw invalidAuthHttpError;
            }
            switch (req.baseUrl) {
                case RouterUrls.Dive:
                    await Authenticator.authenticateDive(req, userId);
                    break;
                case RouterUrls.Club:
                    await Authenticator.authenticateClub(req, userId);
                    break;
                case RouterUrls.Gear:
                    await Authenticator.authenticateGear(req, userId);
                    break;
                case RouterUrls.Group:
                    await Authenticator.authenticateGroup(req, userId);
                    break;
                default:
                    break;
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default Authenticator;
