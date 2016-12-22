import _ from "lodash";
import boom from "boom";
import {EventEmitter} from "events";

export class SpaRouter extends EventEmitter {
	constructor() {
		super();

		this.keys = {};
	}

	/**
	 * 开始中间件
	 */
	attach(proxy, app) {
		this.proxy = proxy;
		this.proxy.exports = _.extend({}, this.proxy.exports || {});

		let fn;

		_.forEach(this.keys, (val, key) => {
			this.proxy.exports[key] = function (data) {
				let context = this;
				context.async = true;
				if (!fn) {
					fn = app.callback();
				}
				if (!context.retId) return;

				fn(key, _.clone(context), data || {});
			};
		});

		return async(ctx, next) => {
			if (this.keys.hasOwnProperty(ctx.routerKey)) {
				await this.keys[ctx.routerKey](ctx, next);
			} else {
				await next();
			}
		};
	}

	/**
	 * 添加路由方法
	 */
	attachRouteToSocket(key, func) {
		this.keys[key] = func;
	}

}