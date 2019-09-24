module.exports = {
    INVALID_AUTH: {
        code: 401,
        message: 'Your username and/or password were incorrect.',
    },
    FORBIDDEN: {
        code: 403,
        message: 'You do not have access to this resource.'
    },
    NOT_FOUND: {
        code: 404,
        message: 'Resource not found.'
    },
    USERNAME_EXISTS: {
        code: 409,
        message: 'A user with that username already exists.'
    },
    USER_ALREADY_IN_GROUP: {
        code: 409,
        message: 'That user is already present in the group.'
    },
    INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT: {
        code: 422,
        message: 'Time in cannot be later than time out.'
    },
    INVALID_ARGUMENT_DIVE_TIME_EXCEEDED: {
        code: 422,
        message: 'Bottom and safety stop time cannot exceed dive time \
            (The difference between time in and time out).'
    }
}