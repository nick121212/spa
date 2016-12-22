"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _application = require("./lib/application");

var _compose = require("./lib/compose");

var _config = require("./lib/config");

var _router = require("./lib/router.middleware");

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

exports.default = {
    Spa: _application.Spa,
    Compose: _compose.Compose,
    configFile: _config.configFile,
    Router: _router.SpaRouter
};
//# sourceMappingURL=index.js.map