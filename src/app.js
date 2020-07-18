const express = require("express");
const cookieParser = require("cookie-parser");
const { Services } = require("@btdrawer/divelog-server-utils");
const { authentication, clearCache } = require("./middleware");
const routerUrls = require("./constants/routerUrls");

const app = express();

(async () => {
    const services = await Services.launchServices();
    const { cacheUtils } = services.cache;

    const middleware = {
        authentication,
        clearCache: clearCache(cacheUtils)
    };

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    Object.values(routerUrls).forEach(route =>
        app.use(
            route,
            require(`./routes${route}Routes`)(middleware, cacheUtils)
        )
    );

    const port = process.env.SERVER_PORT;
    const server = app.listen(port, () =>
        console.log(`Listening on port ${port}`)
    );

    const closeServer = async () => {
        services.closeServices();
        await server.close(() => {
            console.log("Server closed.");
        });
    };

    process.on("SIGTERM", closeServer);
    process.on("SIGINT", closeServer);
})();

module.exports = app;
