import * as vfs from "vinyl-fs";
import { of, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

export function src(globs: string | string[], opt?: vfs.SrcOptions): Observable<NodeJS.ReadWriteStream> {
    return of(vfs.src(globs, opt)).pipe(
        share()
    );
}


src('**/*.ts').subscribe(res => {
    console.log(res);
});
