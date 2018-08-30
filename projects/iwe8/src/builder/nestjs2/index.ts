import { WebapckBaseOption, WebpackMultOption, WebpackBaseBuilder } from '../base';
import { normalize, terminal, Path } from '@angular-devkit/core';
import { Observable, of } from 'rxjs';
import { tap, map, concatMap, debounceTime } from 'rxjs/operators';
import { BuilderContext, BuilderConfiguration, BuildEvent } from '@angular-devkit/architect';
import { join, dirname } from 'path';
import { iwe7TsCompiler } from '../../ts-compiler/index';

export interface GulpSchema {
    tsConfig: string;
    watch: boolean;
}

export class GulpBuilder extends WebpackBaseBuilder<GulpSchema> {
    constructor(public context: BuilderContext) {
        super(context);
    }
    run(builderConfig: BuilderConfiguration<GulpSchema>): Observable<BuildEvent> {
        const options = builderConfig.options;
        const { tsConfig } = options;
        const root = this.context.workspace.root;
        const tsConfigDirname = dirname(tsConfig);
        const tsFile = join(root, normalize(tsConfig));
        const watchRoot = join(root, tsConfigDirname)
        if (options.watch) {
            return this.watch([watchRoot as Path]).pipe(
                debounceTime(3000),
                concatMap(() => {
                    return this.compiler(tsFile, options);
                })
            )
        } else {
            return this.compiler(tsFile, options);
        }
    }

    compiler(tsFile, options) {
        return iwe7TsCompiler(tsFile, options.watch).pipe(
            tap(res => {
                this.context.logger.info(`${terminal.red('info')}: ${terminal.green(res)}`)
            }),
            map(() => {
                // 上传到服务器
                return { success: true };
            })
        );
    }

    getWebpackConfig(builderConfig: BuilderConfiguration<GulpSchema>): Observable<WebapckBaseOption> {
        return of(new WebpackMultOption([], true))
    }
}
export default GulpBuilder;
