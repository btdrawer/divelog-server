import { Request, Response, NextFunction } from "express";
import {
    getResourceId,
    User,
    Dive,
    Club,
    Gear,
    Group,
    UserDocument,
    errorCodes
} from "@btdrawer/divelog-server-core";
import * as jwt from "jsonwebtoken";
import { routerUrls } from "../utils";

class Authenticator {
    private static getAuthData(req: Request): any {
        const header = req.header("Authorization");
        if (!header) {
            throw new Error(errorCodes.INVALID_AUTH);
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
                throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
            } else if (
                dive.user.toString() !== userId &&
                !(req.method === "GET" && dive.public)
            ) {
                throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
            }
        }
    }

    private static async authenticateClub(req: Request, userId: string) {
        if (req.method !== "POST" && req.params.id) {
            const club = await Club.get(req.params.id);
            if (!club) {
                throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
            } else if (req.method === "PUT" || req.method === "DELETE") {
                const isManager = club.managers.some(
                    (manager: UserDocument | string) =>
                        getResourceId(manager) === userId
                );
                if (!isManager && req.url !== `/${req.params.id}/member`) {
                    throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
                }
            }
        }
    }

    private static async authenticateGear(req: Request, userId: string) {
        if (req.method !== "POST" && req.params.id) {
            const gear = await Gear.get(req.params.id);
            if (!gear) {
                throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
            } else if (gear.owner.toString() !== userId) {
                throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
            }
        }
    }

    private static async authenticateGroup(req: Request, userId: string) {
        if (req.params.id) {
            const group = await Group.get(req.params.id);
            if (!group) {
                throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
            }
            const isParticipant = group.participants.some(
                (participant: UserDocument | string) =>
                    getResourceId(participant) === userId
            );
            if (!isParticipant) {
                throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
            }
        }
    }

    static async authenticate(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const userId = Authenticator.getUserId(req);
        const user = await User.get(userId);
        if (!user) {
            throw new Error(errorCodes.INVALID_AUTH);
        }
        switch (req.baseUrl) {
            case routerUrls.DIVE:
                await Authenticator.authenticateDive(req, userId);
                break;
            case routerUrls.CLUB:
                await Authenticator.authenticateClub(req, userId);
                break;
            case routerUrls.GEAR:
                await Authenticator.authenticateGear(req, userId);
                break;
            case routerUrls.GROUP:
                await Authenticator.authenticateGroup(req, userId);
                break;
            default:
                break;
        }
        next();
    }
}

export default Authenticator;
