import { tap, map } from 'rxjs/operators';
import { ProcessSubject } from '../core';
const proc = new ProcessSubject<any>();

proc.pipe(
    tap((res: number) => {
        console.log('begin', res)
        let s = 0;
        for (let i = 0; i < res; i++) {
            s += i;
        }
        proc.next(s);
        proc.complete();
    })
).subscribe();
