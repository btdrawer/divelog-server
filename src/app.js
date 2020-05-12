const express = require("express");
const cookieParser = require("cookie-parser");
const { connect } = require("@btdrawer/divelog-server-utils");
const routerUrls = require("./constants/routerUrls");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

Object.keys(routerUrls).forEach(route => {
    const uri = routerUrls[route];
    app.use(uri, require(`./routes${uri}Routes`));
});

(async () => {
    const { db, redisClient } = await connect();
    global.db = db;
    global.redisClient = redisClient;
})();

const port = process.env.SERVER_PORT;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

const closeServer = async () => {
    await global.db.close();
    await server.close(() => {
        console.log("Server closed.");
    });
};

process.on("SIGTERM", closeServer);
process.on("SIGINT", closeServer);

module.exports = app;
