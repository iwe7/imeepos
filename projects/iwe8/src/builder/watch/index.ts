import { normalize, Path, terminal } from '@angular-devkit/core';
import { BuilderConfiguration, BuildEvent, BuilderContext } from '@angular-devkit/architect';
import { WebpackBaseBuilder, WebpackMultOption, WebapckBaseOption } from "../base";
import { Observable, of, Observer, merge } from 'rxjs';
import { map, tap, debounceTime, switchMap, catchError } from 'rxjs/operators';
import * as gulp from 'gulp';
import { exec } from 'child_process';
export interface WatchOption {
    path: string;
    target: string | string[];
}

export interface WatchOptions {
    targets: WatchOption[];
}

export class WatchBuilder extends WebpackBaseBuilder<WatchOptions> {
    constructor(public context: BuilderContext) {
        super(context);
    }

    run(builderConfig: BuilderConfiguration<WatchOptions>): Observable<BuildEvent> {
        const { options } = builderConfig;
        const { targets } = options;
        const obsers: Observable<any>[] = [];
        targets.map(tar => obsers.push(
            this.watch([normalize(tar.path)]).pipe(
                tap(res => {
                    this.context.logger.info(`[${tar.path}]${res.type}:${res.date} ${res.path}`)
                }),
                switchMap((res) => {
                    const target = tar.target;
                    if (target) {
                        if (Array.isArray(target)) {
                            return merge(
                                target.map(tar => {
                                    return this.buildTarget(tar).pipe(
                                        switchMap(res => {
                                            return this.context.architect.run(res);
                                        })
                                    )
                                })
                            )
                        } else {
                            return this.buildTarget(target).pipe(
                                switchMap(res => {
                                    return this.context.architect.run(res);
                                })
                            );
                        }
                    } else {
                        return of(res);
                    }
                })
            )
        ))
        return merge(
            ...obsers
        ).pipe(
            catchError((err, res) => {
                return res;
            }),
            map(() => ({ success: true }))
        );
    }



    getWebpackConfig(builderConfig: BuilderConfiguration<any>): Observable<WebapckBaseOption> {
        return of(
            new WebpackMultOption([], true, {}, this.getStats(true))
        );
    }
}

export default WatchBuilder;
