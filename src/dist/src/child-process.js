"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const rxjs_1 = require("rxjs");
const core_bidging_1 = require("./core-bidging");
class ForkChildProcessBidging extends core_bidging_1.CoreBidging {
    constructor(option) {
        super(option);
    }
    close(res) {
        this._fork.kill(res);
        this.closed = true;
    }
    send(msg) {
        this._fork.send(msg);
    }
    create(next, error, complete) {
        try {
            this._fork = child_process_1.fork(this.option.file);
            // 接受消息
            rxjs_1.fromEvent(this._fork, 'message').subscribe((res) => {
                if (Array.isArray(res)) {
                    res = res[0];
                }
                if (res.action) {
                    next(res);
                }
                else {
                    next(new core_bidging_1.CoreBidgingEvent('message', res));
                }
            });
        }
        catch (e) {
            error(e);
            return;
        }
    }
}
class ForkChildProcessSubject extends core_bidging_1.CoreBidgingSubject {
    constructor(option) {
        super(option);
        this.config.bidging = ForkChildProcessBidging;
    }
}
exports.ForkChildProcessSubject = ForkChildProcessSubject;
//# sourceMappingURL=child-process.js.map