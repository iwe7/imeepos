import { WebpackConfig } from './webpack-config';
import { BuilderContext } from '@angular-devkit/architect';
import { WebpackOptimization } from './webpack-Optimization';
import { WebpackPerformance } from './webpack-performance';
import { WebpackStats } from './webpack-stats';
import { WebpackExternals } from './webpack-externals';
import { WebpackResolveLoader } from './webpack-resolve-loader';
import { WebpackResolve } from './webpack-resolve';
import { WebpackModule } from './webpack-module';
import { WebpackOutput } from './webpack-output';
import { WebpackPlugin } from './webpack-plugin';
import { WebpackEntry } from './webpack-entry';
import { Configuration, Options, Node, WatchOptions } from 'webpack';

let webpackId: number = 0;

import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class Webpack {
    private mode: "development" | "production" | "none";
    private name: string;
    private context: string;
    private devtool: Options.Devtool;
    private target: 'web' | 'webworker' | 'node' | 'async-node' | 'node-webkit' | 'atom' | 'electron' | 'electron-renderer' | 'electron-main' | ((compiler?: any) => void);
    private bail: boolean;
    private profile: boolean;
    private cache: boolean | object;
    private watch: boolean;
    private watchOptions: WatchOptions;

    private debug: boolean;
    private node: Node | false;
    private amd: { [moduleName: string]: boolean };
    private recordsPath: string;
    private recordsInputPath: string;
    private recordsOutputPath: string;
    private parallelism: number;

    constructor(
        public config: WebpackConfig,
        public entry: WebpackEntry,
        public plugin: WebpackPlugin,
        public output: WebpackOutput,
        public module: WebpackModule,
        public resolve: WebpackResolve,
        public resolveLoader: WebpackResolveLoader,
        public externals: WebpackExternals,
        public stats: WebpackStats,
        public performance: WebpackPerformance,
        public optimization: WebpackOptimization,
    ) {
        webpackId += 1;
        this.name = `webpack-${webpackId}`;
    }

    get(): Configuration {
        return {
            mode: this.mode,
            name: this.name,
            context: this.context,
            entry: this.entry.get(),
            output: this.output,
            devtool: this.devtool,
            plugins: this.plugin.get(),
            stats: this.stats.get(),
            performance: this.performance.get(),
            optimization: this.optimization.get(),
            module: this.module.get(),
            resolve: this.resolve.get(),
            resolveLoader: this.resolveLoader.get(),
            externals: this.externals.get(),
            target: this.target,
            bail: this.bail,
            profile: this.profile,
            cache: this.cache,
            watch: this.watch,
            watchOptions: this.watchOptions,
            debug: this.debug,
            node: this.node,
            amd: this.amd,
            recordsPath: this.recordsPath,
            recordsInputPath: this.recordsInputPath,
            recordsOutputPath: this.recordsOutputPath,
            parallelism: this.parallelism
        }
    }
    setMode(mode: "development" | "production" | "none") {
        this.mode = mode;
    }
}
