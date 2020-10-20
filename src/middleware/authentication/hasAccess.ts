import {
    Dive,
    Club,
    Gear,
    Group,
    errorCodes
} from "@btdrawer/divelog-server-core";

export const diveAuthentication = async (req: any, data: any) => {
    if (req.method !== "POST" && req.params.id) {
        const dive = await Dive.get(req.params.id);
        if (!dive) {
            throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
        } else if (
            dive.user.toString() !== data._id.toString() &&
            !(req.method === "GET" && dive.public)
        ) {
            throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
        }
    }
};

export const clubAuthentication = async (req: any, data: any) => {
    if (req.method !== "POST" && req.params.id) {
        const club = await Club.get(req.params.id);
        if (!club) {
            throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
        } else if (req.method === "PUT" || req.method === "DELETE") {
            const userId = data._id.toString();
            if (
                !club.managers.includes(userId) &&
                req.url !== `/${req.params.id}/member`
            ) {
                throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
            }
        }
    }
};

export const gearAuthentication = async (req: any, data: any) => {
    if (req.method !== "POST" && req.params.id) {
        const gear = await Gear.get(req.params.id);
        if (!gear) {
            throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
        } else if (gear.owner.toString() !== data._id.toString()) {
            throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
        }
    }
};

export const groupAuthentication = async (req: any, data: any) => {
    if (req.params.id) {
        const group = await Group.get(req.params.id);
        if (!group) {
            throw new Error(JSON.stringify(errorCodes.NOT_FOUND));
        } else if (!group.participants.includes(data._id.toString())) {
            throw new Error(JSON.stringify(errorCodes.FORBIDDEN));
        }
    }
};
