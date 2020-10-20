import { errorCodes as ec } from "@btdrawer/divelog-server-core";

export const routerUrls = {
    USER: "/user",
    CLUB: "/club",
    DIVE: "/dive",
    GEAR: "/gear",
    GROUP: "/group"
};

export const errorCodes = {
    CANNOT_ADD_YOURSELF: {
        code: 400,
        message: ec.CANNOT_ADD_YOURSELF
    },
    INVALID_SORT_VALUE: {
        code: 400,
        message: ec.INVALID_SORT_VALUE
    },
    FRIEND_REQUEST_ALREADY_SENT: {
        code: 400,
        message: ec.FRIEND_REQUEST_ALREADY_SENT
    },
    ALREADY_FRIENDS: {
        code: 400,
        message: ec.ALREADY_FRIENDS
    },
    CLUB_DETAILS_MISSING: {
        code: 400,
        message: ec.CLUB_DETAILS_MISSING
    },
    INVALID_AUTH: {
        code: 401,
        message: ec.INVALID_AUTH
    },
    FORBIDDEN: {
        code: 403,
        message: ec.FORBIDDEN
    },
    NOT_FOUND: {
        code: 404,
        message: ec.NOT_FOUND
    },
    USERNAME_EXISTS: {
        code: 409,
        message: ec.USERNAME_EXISTS
    },
    USER_ALREADY_IN_GROUP: {
        code: 409,
        message: ec.USER_ALREADY_IN_GROUP
    },
    INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT: {
        code: 422,
        message: ec.INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT
    },
    INVALID_ARGUMENT_DIVE_TIME_EXCEEDED: {
        code: 422,
        message: ec.INVALID_ARGUMENT_DIVE_TIME_EXCEEDED
    }
};
