import { tap, map } from 'rxjs/operators';
import { CoreBidgingEvent } from '../core/core-bidging';
import { ProcessSubject } from '../core/process';
const proc = new ProcessSubject<CoreBidgingEvent>({});

proc.pipe(
    tap(res => {
        if (res.action === 'start') {
            for (let i = 0; i < 1000000000; i++) {

            }
            proc.next({
                action: "finish",
                payload: {}
            })
        }
    })
).subscribe();
