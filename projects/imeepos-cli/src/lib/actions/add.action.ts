import { AbstractAction, Input } from "./abstract.action";
import { of, Observable } from 'rxjs';
import { tap, switchMap, takeLast } from 'rxjs/operators';
import { iwe7Downloader } from 'iwe8/downloader';
import { mkdirSync, existsSync, createReadStream } from 'fs';
import { dirname } from 'path';
import { Extract } from 'unzip';
export class AddAction extends AbstractAction {
    public handle(input?: Input, options?: Input): Observable<any> {
        return of(null).pipe(
            switchMap(() => {
                const url = `http://localhost:4203/cloud/download`;
                const opt = {
                    plugin: input.get('plugin') || 'iwe8-demo',
                    version: input.get('version') || '1.0.0'
                }
                const output = `/tmp/${opt.plugin}/${opt.version}.zip`;
                const outputPath = dirname(output);
                if (!existsSync(outputPath)) {
                    mkdirSync(outputPath)
                }
                return iwe7Downloader.download(url, output, opt).pipe(
                    takeLast(1),
                    tap(res => {
                        // 解压到 addons
                        createReadStream(output).pipe(
                            Extract({
                                path: 'addons/' + opt.plugin
                            })
                        );
                    })
                )
            }),
        );
    }
}
