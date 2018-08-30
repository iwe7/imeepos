import { LoggingCallback } from '@angular-devkit/build-webpack';
import { normalize, Path, terminal } from '@angular-devkit/core';
import { BuilderConfiguration, BuildEvent, BuilderContext } from '@angular-devkit/architect';
import { WebpackBaseBuilder, WebpackMultOption, WebapckBaseOption } from "../base";
import { Observable, of, interval, Observer, Subject, merge } from 'rxjs';
import { map, tap, concat, skip, debounceTime, switchMap } from 'rxjs/operators';
import { watch } from 'chokidar';

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
                tap(res => this.context.logger.info(`[${tar.path}]${res.type}:${res.date} ${res.path}`)),
                debounceTime(2000),
                switchMap((res) => {
                    const target = tar.target;
                    if (target) {
                        console.log(target);
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
            map(() => ({ success: true }))
        );
    }


    getDate() {
        const now = new Date();
        return terminal.cyan(`${now.getHours()}:${now.getMinutes()}`)
    }

    watch(paths: Path[]) {
        return new Observable((obser: Observer<any>) => {
            watch(paths, {
                persistent: true,
                ignored: [
                    '**/node_modules/*',
                    '**/package.json'
                ]
            })
                .on('change', path => {
                    obser.next({
                        path: terminal.gray(normalize(path)),
                        date: this.getDate(),
                        type: terminal.green('change')
                    })
                })
                .on('add', path => {
                    obser.next({
                        path: terminal.gray(normalize(path)),
                        date: this.getDate(),
                        type: terminal.yellow('add')
                    })
                })
                .on('unlink', path => {
                    obser.next({
                        path: terminal.gray(normalize(path)),
                        date: this.getDate(),
                        type: terminal.red('unlink')
                    })
                });
        })
    }

    getWebpackConfig(builderConfig: BuilderConfiguration<any>): Observable<WebapckBaseOption> {
        return of(
            new WebpackMultOption([], true, {}, this.getStats(true))
        );
    }
}

export default WatchBuilder;
