const express = require("express");
const cookieParser = require("cookie-parser");
const { launchServices } = require("@btdrawer/divelog-server-utils");
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
    const { cacheFunctions, closeServices } = await launchServices();
    global.cacheFunctions = cacheFunctions;

    const port = process.env.SERVER_PORT;
    const server = app.listen(port, () =>
        console.log(`Listening on port ${port}`)
    );

    const closeServer = async () => {
        await closeServices();
        await server.close(() => {
            console.log("Server closed.");
        });
    };

    process.on("SIGTERM", closeServer);
    process.on("SIGINT", closeServer);
})();

module.exports = app;
