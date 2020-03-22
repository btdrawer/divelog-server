const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { INVALID_AUTH } = require("../variables/errorKeys");

const hashPassword = password => bcrypt.hashSync(password, 10);

const getAuthData = req => {
    if (!req.header("Authorization")) throw new Error(INVALID_AUTH);

    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);

    return { token, data };
};

const getUserID = req => getAuthData(req).data._id;

const signJwt = id =>
    jwt.sign({ _id: id }, process.env.JWT_KEY, {
        expiresIn: "3h"
    });

module.exports = {
    hashPassword,
    getAuthData,
    getUserID,
    signJwt
};
