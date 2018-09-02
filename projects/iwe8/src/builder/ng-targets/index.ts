import { concatMap, switchMap } from 'rxjs/operators';
import { Observable, of, concat, merge, Observer } from 'rxjs';
import { BuilderConfiguration } from '@angular-devkit/architect';
import { WebpackBaseBuilder, WebpackMultOption, WebapckBaseOption } from '../base';

export interface NgTargetsOption {
    targets: string[];
    watch: boolean;
}
export class NgTargetsBuilder extends WebpackBaseBuilder<NgTargetsOption> {
    getWebpackConfig(builderConfig: BuilderConfiguration<NgTargetsOption>): Observable<WebapckBaseOption> {
        return new Observable((obser: Observer<WebapckBaseOption>) => {
            const options = builderConfig.options;
            const { targets, watch } = options;
            const obsers = [];
            targets.map(target => {
                obsers.push(
                    this.buildTarget(target).pipe(
                        switchMap(webapckConfig => {
                            return of(webapckConfig).pipe(
                                concatMap(res => this.getBuilder(res)),
                                concatMap((builder: WebpackBaseBuilder<any>) => builder.getWebpackConfig(webapckConfig))
                            )
                        })
                    )
                )
            });
            let cfgs = [];
            return merge(...obsers).subscribe({
                next: (cfg: WebapckBaseOption) => {
                    if (cfg.configs) {
                        cfgs.push(...cfg.configs);
                    }
                },
                complete: () => {
                    obser.next(new WebpackMultOption(cfgs, watch));
                    if (!watch) {
                        obser.complete();
                    }
                }
            })
        })
    }
}

export default NgTargetsBuilder;
