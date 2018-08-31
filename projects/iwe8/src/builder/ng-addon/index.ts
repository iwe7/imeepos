import { IndexHtmlWebpackPlugin } from '@angular-devkit/build-angular/src/angular-cli-files/plugins/index-html-webpack-plugin';
import { switchMap, map, concatMap, last, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BuilderConfiguration } from '@angular-devkit/architect';
import {
    WebpackBaseBuilder, WebapckBaseOption, WebpackMultOption,
    addons, temp, mainfast
} from "../base";
import { stringToFileBuffer } from '@angular-devkit/core/src/virtual-fs/host';
import { normalize, resolve } from '@angular-devkit/core';
import { BrowserBuilderSchema } from '@angular-devkit/build-angular/src/browser/schema';
import * as webpack from 'webpack';
import { join } from 'path';
export interface NgAddonOptions {
    ngTarget: string;
    name: string;
}
export class NgAddonBuilder extends WebpackBaseBuilder<any> {
    getWebpackConfig(builderConfig: BuilderConfiguration<any>): Observable<WebapckBaseOption> {
        const options = builderConfig.options;
        const { ngTarget } = options;
        const ngConfiguration = this.buildTarget<BrowserBuilderSchema>(ngTarget);
        const root = this.context.workspace.root;
        let projectRoot: string;
        let config: any;
        // this.host.list(this.context.workspace.root).subscribe(res => console.log(res));
        // this.host.watch(normalize('projects/iwe8')).subscribe(res => {
        //     console.log(res);
        // });
        return ngConfiguration.pipe(
            concatMap(cfg => {
                config = cfg;
                console.log('ngConfiguration');
                return this.ngc.start({
                    project: cfg.options.tsConfig,
                    watch: false
                }).pipe(
                    tap(res => console.log(res))
                )
            }),
            concatMap(() => {
                const cfg = config;
                console.log('getNgBrowserConfig');
                projectRoot = resolve(root, cfg.root);
                return this.getNgBrowserConfig(cfg);
            }),
            concatMap((config: webpack.Configuration) => {
                config.output.path = join(root, addons, options.name, 'template');
                config.output.library = options.name + '_[name]';
                let main: string = config.entry['main'];
                config.entry = {
                    main: main
                };
                config.optimization.runtimeChunk = false;
                const json = require(join(root, mainfast, 'default', 'mainfast.json'));
                config.plugins.push(
                    new webpack.DllReferencePlugin({
                        context: mainfast + '/' + 'default',
                        manifest: json
                    })
                );
                config.plugins = config.plugins.filter(res => {
                    if (res instanceof IndexHtmlWebpackPlugin) {
                        return false;
                    }
                    return true;
                });
                return of(new WebpackMultOption([config], true, {}, this.getStats(true)));
            })
        )
    }
}

export default NgAddonBuilder;
