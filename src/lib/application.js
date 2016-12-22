/**
 * Created by NICK on 2016/12/16.
 */

import { Server, Client } from "eureca.io";
import { EventEmitter } from "events";
import { Compose } from "./compose";
import _ from "lodash";

let server, client, connections = {};

export class SpaServer extends EventEmitter {
    constructor(config) {
        super();

        this.init(config);
    }

    get server() {
        return server;
    }

    get connections() {
        return connections;
    }

    init(config) {
        server = new Server({
            transport: config.transport,
            allow: config.allow || []
        });
        server.exports = {};
        server.on("connect", (connection) => {
            connections[connection.id] = {
                socket: connection
            };
            this.emit("onconnect", connection, connections[connection.id]);
        });
        server.on("disconnect", (connection) => {
            if (connections[connection.id]) {
                delete connections[connection.id];
            }
        });

        return server;
    }
}

export class SpaClient extends EventEmitter {
    constructor(config) {
        super();

        this.init(config);
    }

    get client() {
        return client;
    }

    get proxy() {
        if (client && client.isReady()) {
            return client.serverProxy;
        }
    }

    init(config) {
        client = new Client({
            uri: config.uri,
            prefix: config.prefix || ""
        });
    }
}

export class Spa extends Compose {
    constructor() {
        super();
    }

    onComplete(ctx) {
        if (ctx.err) {
            console.log("onComplete-----", ctx.err);
        }
        console.log("onComplete-----", ctx.routerKey, ctx.app.jobs, "retId:", ctx.context.retId);
        super.onComplete(ctx);

        ctx.context.return && ctx.context.return(ctx.err || ctx.body);
    }

    initClient(config) {
        this.spaClient = new SpaClient(config);
    }

    initServer(config, app) {
        this.spaServer = new SpaServer(config);
        this.spaServer.server.attach(app);
    }
}