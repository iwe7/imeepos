import { normalize, Path, terminal } from '@angular-devkit/core';
import { BuilderConfiguration, BuildEvent, BuilderContext } from '@angular-devkit/architect';
import { WebpackBaseBuilder, WebpackMultOption, WebapckBaseOption } from "../base";
import { Observable, of, Observer, merge } from 'rxjs';
import { map, tap, debounceTime, switchMap, catchError, distinctUntilChanged } from 'rxjs/operators';
import { watch } from 'chokidar';
import * as fs from 'fs';

export interface WatchOptions {
    change: string;
    add: string;
    unlink: string;
}
export class GitBuilder extends WebpackBaseBuilder<WatchOptions> {
    constructor(public context: BuilderContext) {
        super(context);
    }

    run(builderConfig: BuilderConfiguration<WatchOptions>): Observable<BuildEvent> {
        const { options } = builderConfig;
        return merge(
            this.watch([normalize(this.context.workspace.root)]).pipe(
                tap(res => {
                    this.git.add([res.path]);
                    this.context.logger.info(`[${res.type}]${res.date} ${res.path}`);
                    const now = new Date();
                    const hour = now.getHours();
                    this.git.commit(`[${hour > 9 hour: 0 + '' + hour}${ res.type }]${ options[res.type] ? options[res.type] : res.path }`);
                }),
            )).pipe(
                map(() => ({ success: true }))
            )
    }


    getDate() {
        const now = new Date();
        return terminal.cyan(`${ now.getHours() }: ${ now.getMinutes() }`)
    }

    watch(paths: Path[]) {
        return new Observable((obser: Observer<any>) => {
            watch(paths, {
                persistent: true,
                ignored: [
                    "**/node_modules/**/*",
                    "**/dist/**/*",
                    "**/out-tsc/**/*",
                    "**/publish/**/*",
                    "**/_/**/*",
                    "**/.git/**/*",
                    "**/.DS_Store"
                ]
            })
                .on('change', path => {
                    obser.next({
                        path: normalize(path),
                        date: this.getDate(),
                        type: 'change'
                    })
                })
                .on('add', path => {
                    obser.next({
                        path: normalize(path),
                        date: this.getDate(),
                        type: 'add'
                    })
                })
                .on('unlink', path => {
                    obser.next({
                        path: normalize(path),
                        date: this.getDate(),
                        type: 'unlink'
                    })
                });
        }).pipe(
            tap(res => console.log(res))
        )
    }

    getWebpackConfig(builderConfig: BuilderConfiguration<any>): Observable<WebapckBaseOption> {
        return of(
            new WebpackMultOption([], true, {}, this.getStats(true))
        );
    }
}

export default GitBuilder;
