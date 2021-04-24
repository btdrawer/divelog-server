import { errorCodes } from "@btdrawer/divelog-server-core";

export class HttpError extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const cannotAddYourselfHttpError = new HttpError(
    400,
    errorCodes.CANNOT_ADD_YOURSELF
);

export const invalidSortValueHttpError = new HttpError(
    400,
    errorCodes.INVALID_SORT_VALUE
);

export const friendRequestAlreadySentHttpError = new HttpError(
    400,
    errorCodes.FRIEND_REQUEST_ALREADY_SENT
);

export const alreadyFriendsHttpError =  new HttpError(
    400,
    errorCodes.ALREADY_FRIENDS
);

export const clubDetailsMissingHttpError = new HttpError(
    400,
    errorCodes.CLUB_DETAILS_MISSING
);

export const invalidAuthHttpError = new HttpError(
    401,
    errorCodes.INVALID_AUTH
);

export const forbiddenHttpError = new HttpError(
    403,
    errorCodes.FORBIDDEN
);

export const notFoundHttpError = new HttpError(
    404,
    errorCodes.NOT_FOUND
);

export const usernameExistsHttpError = new HttpError(
    409,
    errorCodes.USERNAME_EXISTS
);

export const userAlreadyInGroupHttpError = new HttpError(
    409,
    errorCodes.USER_ALREADY_IN_GROUP
);

export const invalidArgumentTimeInLaterThanOutHttpError = new HttpError(
    422,
    errorCodes.INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT
);

export const invalidArgumentDiveTimeExceededHttpError = new HttpError(
    422,
    errorCodes.INVALID_ARGUMENT_DIVE_TIME_EXCEEDED
);
