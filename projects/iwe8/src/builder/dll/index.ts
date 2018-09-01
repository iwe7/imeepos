import { map } from 'rxjs/operators';
import { join } from '@angular-devkit/core';
import { Observable, of } from 'rxjs';
import { BuilderContext, BuilderConfiguration } from '@angular-devkit/architect';
import * as webpack from 'webpack';
import { WebpackBaseBuilder, WebapckBaseOption, WebpackMultOption } from '../base';
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

export class DllBuilder extends WebpackBaseBuilder<DllOptions> {
    constructor(public context: BuilderContext) {
        super(context);
    }
    getWebpackConfig(builderConfig: BuilderConfiguration<DllOptions>): Observable<WebapckBaseOption> {
        const options = builderConfig.options;
        return this.getWebpackConfig2(options).pipe(
            map(cfg => {
                return new WebpackMultOption([cfg]);
            })
        );
    }
    getWebpackConfig2(options: DllOptions): Observable<Configuration> {
        const root = this.context.workspace.root;
        const fileName = '[name]';
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
