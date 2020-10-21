import { Request } from "express";
import {
    getResourceId,
    documentTypes,
    Dive,
    Club,
    Gear,
    Group,
    errorCodes
} from "@btdrawer/divelog-server-core";

export const diveAuthentication = async (
    req: Request,
    user: string
): Promise<void> => {
    if (req.method !== "POST" && req.params.id) {
        const dive = await Dive.get(req.params.id);
        if (!dive) {
            throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
        } else if (
            dive.user.toString() !== user &&
            !(req.method === "GET" && dive.public)
        ) {
            throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
        }
    }
};

export const clubAuthentication = async (
    req: Request,
    user: string
): Promise<void> => {
    if (req.method !== "POST" && req.params.id) {
        const club = await Club.get(req.params.id);
        if (!club) {
            throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
        } else if (req.method === "PUT" || req.method === "DELETE") {
            const isManager = club.managers.some(
                (manager: documentTypes.UserDocument | string) =>
                    getResourceId(manager) === user
            );
            if (!isManager && req.url !== `/${req.params.id}/member`) {
                throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
            }
        }
    }
};

export const gearAuthentication = async (
    req: Request,
    user: string
): Promise<void> => {
    if (req.method !== "POST" && req.params.id) {
        const gear = await Gear.get(req.params.id);
        if (!gear) {
            throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
        } else if (gear.owner.toString() !== user) {
            throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
        }
    }
};

export const groupAuthentication = async (
    req: Request,
    user: string
): Promise<void> => {
    if (req.params.id) {
        const group = await Group.get(req.params.id);
        if (!group) {
            throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
        }
        const isParticipant = group.participants.some(
            (participant: documentTypes.UserDocument | string) =>
                getResourceId(participant) === user
        );
        if (!isParticipant) {
            throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
        }
    }
};
