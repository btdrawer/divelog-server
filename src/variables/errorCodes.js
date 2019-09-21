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
    }
}