import { Services } from "@btdrawer/divelog-server-core";
import serverless from "serverless-http";
import App from "./App";

const handler = async () => {
    const services = await Services.launchServices();
    const { app } = new App(services);
    return serverless(app);
};

export default handler;
