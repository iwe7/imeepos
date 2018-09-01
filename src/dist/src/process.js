"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const core_bidging_1 = require("./core-bidging");
class CoreProcess extends core_bidging_1.CoreBidging {
    close(msg) {
        process.exit(msg);
    }
    create(next, error, complete) {
        rxjs_1.fromEvent(process, 'exit').subscribe(res => {
            complete();
        });
        rxjs_1.fromEvent(process, 'disconnect').subscribe(res => {
            complete();
        });
        rxjs_1.fromEvent(process, 'message').subscribe((res) => {
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
    send(msg, handel) {
        if (process.send) {
            process.send(msg, handel);
        }
        else if (process.emit) {
            process.emit('message', msg, handel);
        }
    }
}
exports.CoreProcess = CoreProcess;
class ProcessSubject extends core_bidging_1.CoreBidgingSubject {
    constructor(option) {
        super(option);
        option.bidging = CoreProcess;
    }
}
exports.ProcessSubject = ProcessSubject;
//# sourceMappingURL=process.js.map