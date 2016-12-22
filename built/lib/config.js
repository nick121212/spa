"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.configFile = exports.Configurator = undefined;

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

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _events = require("events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Configurator = exports.Configurator = function (_EventEmitter) {
	(0, _inherits3.default)(Configurator, _EventEmitter);

	function Configurator(file, reload) {
		(0, _classCallCheck3.default)(this, Configurator);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Configurator.__proto__ || (0, _getPrototypeOf2.default)(Configurator)).call(this));

		_this.config = {};
		_this.oldConfig = {};
		_this.automaticConfigReload = reload;
		_this.updateConfig(file);
		return _this;
	}

	(0, _createClass3.default)(Configurator, [{
		key: "updateConfig",
		value: function updateConfig(file) {
			_util2.default.log("[" + process.pid + "] reading config file: " + file);
			var config = JSON.parse(_fs2.default.readFileSync(file, "utf8"));

			// fs.watch(file, (event, filename) => {
			//     if (event == 'change' && this.config.automaticConfigReload != false) {
			//         this.updateConfig();
			//     }
			// });

			this.oldConfig = this.config;
			this.config = config;
		}
	}]);
	return Configurator;
}(_events.EventEmitter);

var configFile = exports.configFile = function configFile() {
	if (process.argv.length < 2) {
		console.log("没有定义config文件");
		process.exit(1);
	}
	var config = new Configurator(process.argv[2]);

	return config.config;
};
//# sourceMappingURL=config.js.map