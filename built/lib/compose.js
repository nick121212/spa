"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Compose = exports.compose = undefined;

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

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _events = require("events");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require("boom");

var _boom2 = _interopRequireDefault(_boom);

var _bluebird = require("bluebird");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compose = exports.compose = function compose(middleware) {
    if (!Array.isArray(middleware)) throw new TypeError("Middleware stack must be an array!");
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(middleware), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var fn = _step.value;

            if (typeof fn !== "function") throw new TypeError("Middleware must be composed of functions!");
        }

        /**
         * @param {Object} context
         * @return {Promise}
         * @api public
         */
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return function (context, next) {
        return new _bluebird.Promise(function (resolve, reject) {
            var index = -1;

            var dispatch = function () {
                var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(i) {
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    return _context.abrupt("return", new _bluebird.Promise(function (resolve1, reject1) {
                                        if (i <= index) {
                                            return reject1(_boom2.default.create(610, "next() called multiple times" + i + "-" + index));
                                        }
                                        index = i;
                                        var fn = middleware[i];
                                        if (i === middleware.length) fn = next;
                                        if (!fn) {
                                            return resolve(context);
                                        }
                                        try {
                                            // Promise.try(async() => {
                                            resolve1(fn(context, function () {
                                                dispatch(i + 1);
                                            }));
                                            // }).then(resolveFunc).catch(reject);
                                        } catch (err) {
                                            reject1(err);
                                        }
                                    }).catch(reject));

                                case 1:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, undefined);
                }));

                return function dispatch(_x) {
                    return _ref.apply(this, arguments);
                };
            }();
            dispatch(0).catch(reject);
        });
    };
};

var Compose = exports.Compose = function (_EventEmitter) {
    (0, _inherits3.default)(Compose, _EventEmitter);

    function Compose() {
        (0, _classCallCheck3.default)(this, Compose);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Compose.__proto__ || (0, _getPrototypeOf2.default)(Compose)).call(this));

        _this.middlewares = [];
        _this.jobs = 0;
        return _this;
    }

    (0, _createClass3.default)(Compose, [{
        key: "next",
        value: function next(ctx) {}
    }, {
        key: "onError",
        value: function onError(err, ctx) {
            console.error("compose.js", ctx.app.jobs);
            ctx.err = err;
        }
    }, {
        key: "onComplete",
        value: function onComplete(ctx) {
            ctx.app.jobs--;
            this.emit("complete", ctx);
        }
    }, {
        key: "use",
        value: function use(fn) {
            if (!_lodash2.default.isFunction(fn)) {
                throw new TypeError("middleware must be a function！");
            }

            this.middlewares.push(fn);
        }
    }, {
        key: "callback",
        value: function callback(next) {
            var _this2 = this;

            var fn = compose(this.middlewares);

            if (next) {
                this.next = next;
            }

            return function (routerKey, context, params) {
                var ctx = _lodash2.default.extend({}, {
                    routerKey: routerKey,
                    params: params,
                    context: context,
                    app: _this2
                });
                _this2.jobs++;

                return fn(ctx, function () {
                    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        _this2.next(ctx);
                                        _context2.next = 3;
                                        return next();

                                    case 3:
                                    case "end":
                                        return _context2.stop();
                                }
                            }
                        }, _callee2, _this2);
                    }));

                    return function (_x2, _x3) {
                        return _ref2.apply(this, arguments);
                    };
                }()).tap(function () {}).catch(function (err) {
                    _this2.onError(err, ctx);
                }).finally(function () {
                    _this2.onComplete(ctx);
                });
            };
        }
    }]);
    return Compose;
}(_events.EventEmitter);
//# sourceMappingURL=compose.js.map