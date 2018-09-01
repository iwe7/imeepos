"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/internal/Subject");
const rxjs_1 = require("rxjs");
const events_1 = require("events");
const tryCatch_1 = require("rxjs/util/tryCatch");
const errorObject_1 = require("rxjs/util/errorObject");
class CoreBidgingEvent {
    constructor(action, payload) {
        this.action = action;
        this.payload = payload;
    }
}
exports.CoreBidgingEvent = CoreBidgingEvent;
class CoreBidging extends events_1.EventEmitter {
    constructor(option) {
        super();
        this.closed = false;
        this.option = option;
    }
}
exports.CoreBidging = CoreBidging;
class CoreBidgingSubject extends Subject_1.AnonymousSubject {
    constructor(config, destination) {
        super();
        this.config = config;
        this._output = new rxjs_1.Subject();
        if (!this.config.serializer) {
            this.config.serializer = (value) => value;
        }
        if (!this.config.deserializer) {
            this.config.deserializer = (value) => value;
        }
        this.destination = destination || new rxjs_1.ReplaySubject();
    }
    createBidging() {
        const bidging = new this.config.bidging(this.config);
        bidging.create((res) => {
            const result = tryCatch_1.tryCatch(this.config.deserializer)(res);
            if (result === errorObject_1.errorObject) {
                this._output.error(errorObject_1.errorObject.e);
            }
            else {
                this._output.next(result);
            }
        }, (err) => {
            this._resetState();
            this._output.error(err);
        }, () => {
            this._resetState();
            this._output.complete();
        });
        const subscription = new rxjs_1.Subscription(() => {
            this._bidging = null;
            if (bidging && !bidging.closed) {
                bidging.close();
            }
        });
        const queue = this.destination;
        this.destination = rxjs_1.Subscriber.create((x) => {
            if (!bidging.closed) {
                const msg = tryCatch_1.tryCatch(this.config.serializer)(x);
                if (msg === errorObject_1.errorObject) {
                    this.destination.error(errorObject_1.errorObject.e);
                    return;
                }
                bidging.send(msg);
            }
        }, (e) => {
            this._output.error(e);
            this._resetState();
        }, () => {
            bidging.close();
            this._resetState();
        });
        if (queue && queue instanceof rxjs_1.ReplaySubject) {
            subscription.add(queue.subscribe(this.destination));
        }
        return bidging;
    }
    _subscribe(subscriber) {
        const { source } = this;
        if (source) {
            return source.subscribe(subscriber);
        }
        if (!this._bidging) {
            this._bidging = this.createBidging();
        }
        this._output.subscribe(subscriber);
        subscriber.add(() => {
            const { _bidging } = this;
            if (this._output.observers.length === 0) {
                if (_bidging && !_bidging.closed) {
                    _bidging.close();
                }
                this._resetState();
            }
        });
        return subscriber;
    }
    unsubscribe() {
        const { source, _bidging } = this;
        if (_bidging && !_bidging.closed) {
            _bidging.close();
            this._resetState();
        }
        super.unsubscribe();
        if (!source) {
            this.destination = new rxjs_1.ReplaySubject();
        }
    }
    _resetState() {
        this._bidging = null;
        if (!this.source) {
            this.destination = new rxjs_1.ReplaySubject();
        }
        this._output = new rxjs_1.Subject();
    }
}
exports.CoreBidgingSubject = CoreBidgingSubject;
//# sourceMappingURL=core-bidging.js.map