import { map, switchMap } from 'rxjs/operators';
import { virtualFs, join } from '@angular-devkit/core';
import { WebpackBuilder } from '@angular-devkit/build-webpack';
import { Observable, of } from 'rxjs';
import { Builder, BuilderConfiguration, BuildEvent, BuilderContext } from '@angular-devkit/architect';
import * as webpack from 'webpack';
import * as fs from 'fs';
import { Configuration } from 'webpack';
interface Entry {
    [name: string]: string[];
}
export interface DllOptions {
    entry: Entry;
    deps: string[];
    name: string;
}
import { mainfast } from '../base';
export class DllBuilder implements Builder<DllOptions>{
    webpack: WebpackBuilder;
    host: virtualFs.AliasHost<fs.Stats>;
    constructor(public context: BuilderContext) {
        this.webpack = new WebpackBuilder(context);
        this.host = new virtualFs.AliasHost(this.context.host as virtualFs.Host<fs.Stats>);
    }
    run(builderConfig: BuilderConfiguration<DllOptions>): Observable<BuildEvent> {
        const options = builderConfig.options;

        return this.getWebpackConfig(options).pipe(
            switchMap(webpackConfig => {
                return this.webpack.runWebpack(webpackConfig);
            })
        );
    }
    getWebpackConfig(options: DllOptions): Observable<Configuration> {
        const root = this.context.workspace.root;
        const fileName = '[name]_[chunkhash]';
        const cfg = {
            path: join(root, mainfast, options.name, `${options.name}.json`),
            name: fileName,
            context: mainfast,
        };
        const plugins = [
            new webpack.DllPlugin(cfg)
        ]
        if (options.deps) {
            options.deps.map(name => {
                const json = require(join(root, mainfast, name, name + '.json'));
                plugins.push(
                    new webpack.DllReferencePlugin({
                        context: mainfast,
                        manifest: json
                    })
                );
            })
        }
        return of(null).pipe(
            map(() => {
                return {
                    entry: options.entry,
                    mode: "production",
                    output: {
                        path: join(root, mainfast),
                        filename: '[name]/[name].js',
                        library: fileName,
                    },
                    plugins: [
                        ...plugins
                    ]
                } as Configuration;
            })
        );
    }
}

export default DllBuilder;
