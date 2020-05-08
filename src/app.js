const express = require("express");
const cookieParser = require("cookie-parser");
const { connect } = require("@btdrawer/divelog-server-utils");
const routerUrls = require("./constants/routerUrls");

const app = express();

(async () => {
    const { db, redisClient } = await connect();
    global.db = db;
    global.redisClient = redisClient;
})();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

for (let route in routerUrls) {
    const uri = routerUrls[route];
    app.use(uri, require(`./routes${uri}Routes`));
}

const port = process.env.SERVER_PORT;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

const closeServer = async () => {
    await server.close(() => {
        console.log("Server closed.");
    });
    await global.db.close();
};

process.on("SIGTERM", closeServer);
process.on("SIGINT", closeServer);

module.exports = app;
