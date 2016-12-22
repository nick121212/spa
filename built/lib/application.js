"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Spa = exports.SpaClient = exports.SpaServer = undefined;

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _eureca = require("eureca.io");

var _events = require("events");

var _compose = require("./compose");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by NICK on 2016/12/16.
 */

var server = void 0,
    client = void 0,
    connections = {};

var SpaServer = exports.SpaServer = function (_EventEmitter) {
    (0, _inherits3.default)(SpaServer, _EventEmitter);

    function SpaServer(config) {
        (0, _classCallCheck3.default)(this, SpaServer);

        var _this = (0, _possibleConstructorReturn3.default)(this, (SpaServer.__proto__ || (0, _getPrototypeOf2.default)(SpaServer)).call(this));

        _this.init(config);
        return _this;
    }

    (0, _createClass3.default)(SpaServer, [{
        key: "init",
        value: function init(config) {
            var _this2 = this;

            server = new _eureca.Server({
                transport: config.transport,
                allow: config.allow || []
            });
            server.exports = {};
            server.on("connect", function (connection) {
                connections[connection.id] = {
                    socket: connection
                };
                _this2.emit("onconnect", connection, connections[connection.id]);
            });
            server.on("disconnect", function (connection) {
                if (connections[connection.id]) {
                    delete connections[connection.id];
                }
            });

            return server;
        }
    }, {
        key: "server",
        get: function get() {
            return server;
        }
    }, {
        key: "connections",
        get: function get() {
            return connections;
        }
    }]);
    return SpaServer;
}(_events.EventEmitter);

var SpaClient = exports.SpaClient = function (_EventEmitter2) {
    (0, _inherits3.default)(SpaClient, _EventEmitter2);

    function SpaClient(config) {
        (0, _classCallCheck3.default)(this, SpaClient);

        var _this3 = (0, _possibleConstructorReturn3.default)(this, (SpaClient.__proto__ || (0, _getPrototypeOf2.default)(SpaClient)).call(this));

        _this3.init(config);
        return _this3;
    }

    (0, _createClass3.default)(SpaClient, [{
        key: "init",
        value: function init(config) {
            client = new _eureca.Client({
                uri: config.uri,
                prefix: config.prefix || ""
            });
        }
    }, {
        key: "client",
        get: function get() {
            return client;
        }
    }, {
        key: "proxy",
        get: function get() {
            if (client && client.isReady()) {
                return client.serverProxy;
            }
        }
    }]);
    return SpaClient;
}(_events.EventEmitter);

var Spa = exports.Spa = function (_Compose) {
    (0, _inherits3.default)(Spa, _Compose);

    function Spa() {
        (0, _classCallCheck3.default)(this, Spa);
        return (0, _possibleConstructorReturn3.default)(this, (Spa.__proto__ || (0, _getPrototypeOf2.default)(Spa)).call(this));
    }

    (0, _createClass3.default)(Spa, [{
        key: "onComplete",
        value: function onComplete(ctx) {
            if (ctx.err) {
                console.log("onComplete-----", ctx.err);
            }
            console.log("onComplete-----", ctx.routerKey, ctx.app.jobs, "retId:", ctx.context.retId);
            (0, _get3.default)(Spa.prototype.__proto__ || (0, _getPrototypeOf2.default)(Spa.prototype), "onComplete", this).call(this, ctx);

            ctx.context.return && ctx.context.return(ctx.err || ctx.body);
        }
    }, {
        key: "initClient",
        value: function initClient(config) {
            this.spaClient = new SpaClient(config);
        }
    }, {
        key: "initServer",
        value: function initServer(config, app) {
            this.spaServer = new SpaServer(config);
            this.spaServer.server.attach(app);
        }
    }]);
    return Spa;
}(_compose.Compose);
//# sourceMappingURL=application.js.map