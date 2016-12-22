import { EventEmitter } from "events";
import _ from "lodash";
import boom from "boom";
import { Promise } from "bluebird";

export const compose = (middleware) => {
    if (!Array.isArray(middleware)) throw new TypeError("Middleware stack must be an array!");
    for (const fn of middleware) {
        if (typeof fn !== "function") throw new TypeError("Middleware must be composed of functions!");
    }

    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */
    return (context, next) => {
        return new Promise((resolve, reject) => {
            let index = -1;

            const dispatch = async(i) => {
                return new Promise((resolve1, reject1) => {
                    if (i <= index) {
                        return reject1(boom.create(610, "next() called multiple times" + i + "-" + index));
                    }
                    index = i;
                    let fn = middleware[i];
                    if (i === middleware.length) fn = next;
                    if (!fn) {
                        return resolve(context);
                    }
                    try {
                        // Promise.try(async() => {
                        resolve1(fn(context, () => {
                            dispatch(i + 1);
                        }));
                        // }).then(resolveFunc).catch(reject);
                    } catch (err) {
                        reject1(err);
                    }
                }).catch(reject);
            };
            dispatch(0).catch(reject);
        });
    };
};

export class Compose extends EventEmitter {
    constructor() {
        super();

        this.middlewares = [];
        this.jobs = 0;
    }

    next(ctx) {}

    onError(err, ctx) {
        console.error("compose.js", ctx.app.jobs);
        ctx.err = err;
    }

    onComplete(ctx) {
        ctx.app.jobs--;
        this.emit("complete", ctx);
    }

    use(fn) {
        if (!_.isFunction(fn)) {
            throw new TypeError("middleware must be a function！");
        }

        this.middlewares.push(fn);
    }

    callback(next) {
        const fn = compose(this.middlewares);

        if (next) {
            this.next = next;
        }

        return (routerKey, context, params) => {
            let ctx = _.extend({}, {
                routerKey: routerKey,
                params: params,
                context: context,
                app: this
            });
            this.jobs++;

            return fn(ctx, async(ctx, next) => {
                this.next(ctx);
                await next();
            }).tap(() => {}).catch((err) => {
                this.onError(err, ctx);
            }).finally(() => {
                this.onComplete(ctx);
            });
        };
    }
}