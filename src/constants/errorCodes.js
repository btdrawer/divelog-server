const { errorCodes } = require("@btdrawer/divelog-server-utils");

module.exports = {
    CANNOT_ADD_YOURSELF: {
        code: 400,
        message: errorCodes.CANNOT_ADD_YOURSELF
    },
    INVALID_SORT_VALUE: {
        code: 400,
        message: errorCodes.INVALID_SORT_VALUE
    },
    FRIEND_REQUEST_ALREADY_SENT: {
        code: 400,
        message: errorCodes.FRIEND_REQUEST_ALREADY_SENT
    },
    ALREADY_FRIENDS: {
        code: 400,
        message: errorCodes.ALREADY_FRIENDS
    },
    CLUB_DETAILS_MISSING: {
        code: 400,
        message: errorCodes.CLUB_DETAILS_MISSING
    },
    INVALID_AUTH: {
        code: 401,
        message: errorCodes.INVALID_AUTH
    },
    FORBIDDEN: {
        code: 403,
        message: errorCodes.FORBIDDEN
    },
    NOT_FOUND: {
        code: 404,
        message: errorCodes.NOT_FOUND
    },
    USERNAME_EXISTS: {
        code: 409,
        message: errorCodes.USERNAME_EXISTS
    },
    USER_ALREADY_IN_GROUP: {
        code: 409,
        message: errorCodes.USER_ALREADY_IN_GROUP
    },
    INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT: {
        code: 422,
        message: errorCodes.INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT
    },
    INVALID_ARGUMENT_DIVE_TIME_EXCEEDED: {
        code: 422,
        message: errorCodes.INVALID_ARGUMENT_DIVE_TIME_EXCEEDED
    }
};
