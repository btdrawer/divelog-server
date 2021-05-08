import AppWrapper from './AppWrapper';

AppWrapper.init()
    .then(wrapper => {
        const port = process.env.SERVER_PORT;
        const server = wrapper.app.listen(port, () =>
            console.log(`Listening on port ${port}`)
        );
        process.on("SIGTERM", () => wrapper.close(server));
        process.on("SIGINT", () => wrapper.close(server));
    });
