/**
 * Created by NICK on 2016/12/16.
 */

// import { Spa } from "./lib/application";
// import http from "http";

// import * as controller from "./controler";

// const spa = new Spa();
// const server = http.createServer();

// spa.initClient({
//     "uri": "http://localhost:3001/",
//     "prefix": "eureca.io",
//     "transport": null
// });
// spa.initServer({
//     "prefix": "eureca.io",
//     "transport": null,
//     "allow ": []
// }, server);

// spa.use(controller.router().attach(spa.spaClient.client, spa));
// spa.use(controller.router1().attach(spa.spaClient.client, spa));

// server.listen(3002);

import { Spa } from "./lib/application";
import { Compose } from "./lib/compose";
import { configFile } from "./lib/config";
import { SpaRouter } from "./lib/router.middleware";

export default {
    Spa: Spa,
    Compose: Compose,
    configFile: configFile,
    Router: SpaRouter
};