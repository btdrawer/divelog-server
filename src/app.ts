import express from "express";
import cookieParser from "cookie-parser";
import { Services } from "@btdrawer/divelog-server-core";
import { authentication, clearCache } from "./middleware";
import { routerUrls } from "./utils";

const app = express();

(async () => {
    const services = await Services.launchServices();

    const middleware = {
        authentication,
        clearCache: clearCache(services.cache.clearCache)
    };

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    Object.values(routerUrls).forEach(route =>
        app.use(
            route,
            require(`./routes${route}Routes`)(
                middleware,
                services.cache.queryWithCache
            )
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

export default app;
