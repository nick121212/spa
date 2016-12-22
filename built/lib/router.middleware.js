"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SpaRouter = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require("boom");

var _boom2 = _interopRequireDefault(_boom);

var _events = require("events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SpaRouter = exports.SpaRouter = function (_EventEmitter) {
	(0, _inherits3.default)(SpaRouter, _EventEmitter);

	function SpaRouter() {
		(0, _classCallCheck3.default)(this, SpaRouter);

		var _this = (0, _possibleConstructorReturn3.default)(this, (SpaRouter.__proto__ || (0, _getPrototypeOf2.default)(SpaRouter)).call(this));

		_this.keys = {};
		return _this;
	}

	/**
  * 开始中间件
  */


	(0, _createClass3.default)(SpaRouter, [{
		key: "attach",
		value: function attach(proxy, app) {
			var _this2 = this;

			this.proxy = proxy;
			this.proxy.exports = _lodash2.default.extend({}, this.proxy.exports || {});

			var fn = void 0;

			_lodash2.default.forEach(this.keys, function (val, key) {
				_this2.proxy.exports[key] = function (data) {
					var context = this;
					context.async = true;
					if (!fn) {
						fn = app.callback();
					}
					if (!context.retId) return;

					fn(key, _lodash2.default.clone(context), data || {});
				};
			});

			return function () {
				var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
					return _regenerator2.default.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									if (!_this2.keys.hasOwnProperty(ctx.routerKey)) {
										_context.next = 5;
										break;
									}

									_context.next = 3;
									return _this2.keys[ctx.routerKey](ctx, next);

								case 3:
									_context.next = 7;
									break;

								case 5:
									_context.next = 7;
									return next();

								case 7:
								case "end":
									return _context.stop();
							}
						}
					}, _callee, _this2);
				}));

				return function (_x, _x2) {
					return _ref.apply(this, arguments);
				};
			}();
		}

		/**
   * 添加路由方法
   */

	}, {
		key: "attachRouteToSocket",
		value: function attachRouteToSocket(key, func) {
			this.keys[key] = func;
		}
	}]);
	return SpaRouter;
}(_events.EventEmitter);
//# sourceMappingURL=router.middleware.js.map