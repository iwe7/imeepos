import { NgcBuilder } from './../ngc/index';
import { WebpackConfigOptions } from '@angular-devkit/build-angular/src/angular-cli-files/models/build-options';
import { requireProjectModule } from '@angular-devkit/build-angular/src/angular-cli-files/utilities/require-project-module';
import { readTsconfig } from '@angular-devkit/build-angular/src/angular-cli-files/utilities/read-tsconfig';
import { normalizeFileReplacements, normalizeAssetPatterns, defaultProgress } from '@angular-devkit/build-angular/src/utils';
import { resolve, virtualFs, Path, normalize, getSystemPath, terminal } from '@angular-devkit/core';
import { WebpackMultNestServerBuilder, WebpackMultNestServerOption } from './webpack-mult-nest';
import { concatMap, tap, map } from 'rxjs/operators';
import { Builder, BuilderContext, BuilderConfiguration, BuildEvent, BuilderDescription } from '@angular-devkit/architect';
import { Observable, of, concat, throwError, Observer } from 'rxjs';
import { last } from 'rxjs/operators';
import { WebpackMultBuilder, WebpackMultOption } from './webpack-mult';
import { NormalizedBrowserBuilderSchema } from '@angular-devkit/build-angular/src/browser';
import { BrowserBuilderSchema } from '@angular-devkit/build-angular/src/browser/schema';
import { WebpackMultDevServerBuilder, WebpackMultDevServerOption } from './webpack-mult-dev-server';
import {
    getAotConfig,
    getBrowserConfig,
    getCommonConfig,
    getNonAotConfig,
    getStatsConfig,
    getStylesConfig,
    getWebpackStatsConfig,
    getServerConfig
} from '@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs';
import * as fs from 'fs';
import { Stats } from 'fs';
import * as ts from 'typescript';
import * as webpack from 'webpack';
const webpackMerge = require('webpack-merge');
import * as Git from 'simple-git';
import { watch } from 'chokidar';
import { BuildWebpackServerSchema } from '@angular-devkit/build-angular/src/server/schema';
export type WebapckBaseOption = WebpackMultOption |
    WebpackMultNestServerOption |
    WebpackMultDevServerOption;
export abstract class WebpackBaseBuilder<T> implements Builder<T> {
    public webpack: WebpackMultBuilder;
    public webpackDev: WebpackMultDevServerBuilder;
    public webpackNest: WebpackMultNestServerBuilder;
    public ngc: NgcBuilder;
    host: virtualFs.AliasHost<fs.Stats>;
    git: Git;
    constructor(
        public context: BuilderContext
    ) {
        this.webpack = new WebpackMultBuilder(context);
        this.webpackDev = new WebpackMultDevServerBuilder(context);
        this.webpackNest = new WebpackMultNestServerBuilder(context);
        this.host = new virtualFs.AliasHost(this.context.host as virtualFs.Host<fs.Stats>);
        this.ngc = new NgcBuilder(context);
        this.git = new Git(this.context.workspace.root);
    }

    run(builderConfig: BuilderConfiguration<T>): Observable<BuildEvent> {
        return this.getWebpackConfig(builderConfig).pipe(
            concatMap((config: any) => {
                if (config instanceof WebpackMultOption) {
                    return this.webpack.run(config);
                } else if (config instanceof WebpackMultNestServerOption) {
                    return this.webpackNest.run(config);
                } else if (config instanceof WebpackMultDevServerOption) {
                    return this.webpackDev.run(config);
                } else {
                    return this.runOther(config);
                }
            })
        );
    }
    runOther(config: any): Observable<BuildEvent> {
        return of({ success: true });
    }

    abstract getWebpackConfig(builderConfig: BuilderConfiguration<T>): Observable<WebapckBaseOption>;


    getBuilder(builderConfig: BuilderConfiguration<T>): Observable<Builder<T>> {
        const architect = this.context.architect;
        return architect.getBuilderDescription<T>(builderConfig).pipe(
            concatMap(builderDescription => {
                const context = this.context;
                return of(architect.getBuilder<T>(builderDescription, context));
            })
        );
    }

    buildTarget<T = any>(path: string, overrides: any = {}): Observable<BuilderConfiguration<T>> {
        const architect = this.context.architect;
        const [project, target, configuration] = path.split(':');
        let builderConfig = architect.getBuilderConfiguration<T>({
            project,
            target,
            configuration,
            overrides,
        });
        let builderDescription: BuilderDescription;
        return architect.getBuilderDescription(builderConfig).pipe(
            tap(description => builderDescription = description),
            concatMap(() => architect.validateBuilderOptions(builderConfig, builderDescription)),
            tap(validatedBuilderConfig => builderConfig = validatedBuilderConfig),
            map(() => builderConfig)
        );
    }

    deleteOutputDir(root: Path, outputPath: Path, host: virtualFs.Host) {
        const resolvedOutputPath = resolve(root, outputPath);
        if (resolvedOutputPath === root) {
            throw new Error('Output path MUST not be project root directory!');
        }
        return host.exists(resolvedOutputPath).pipe(
            concatMap(exists => exists
                ? concat(host.delete(resolvedOutputPath), of(null)).pipe(last())
                : of(null)),
        );
    }

    getNgBrowserConfig(builderConfig: BuilderConfiguration<BrowserBuilderSchema>) {
        const options = builderConfig.options;
        const root = this.context.workspace.root;
        const projectRoot = resolve(root, builderConfig.root);
        return of(null).pipe(
            concatMap(() => options.deleteOutputPath
                ? this.deleteOutputDir(root, normalize(options.outputPath), this.context.host)
                : of(null)),
            concatMap(() => normalizeFileReplacements(options.fileReplacements, this.host, root)),
            tap(fileReplacements => options.fileReplacements = fileReplacements),
            concatMap(() => normalizeAssetPatterns(
                options.assets, this.host, root, projectRoot, builderConfig.sourceRoot)
            ),
            tap((assetPatternObjects => options.assets = assetPatternObjects)),
            concatMap(() => {
                let webpackConfig;
                try {
                    webpackConfig = this.buildNgBrowserWebpackConfig(
                        root,
                        projectRoot,
                        this.host,
                        options as NormalizedBrowserBuilderSchema
                    );
                } catch (e) {
                    return throwError(e);
                }
                return of(webpackConfig);
            })
        );
    }

    getStats(verbose: boolean): webpack.Stats {
        return getWebpackStatsConfig(verbose) as any;
    }

    getNgServerConfig(builderConfig: BuilderConfiguration<BuildWebpackServerSchema>) {
        const options = builderConfig.options;
        const root = this.context.workspace.root;
        const projectRoot = resolve(root, builderConfig.root);
        return of(null).pipe(
            concatMap(() => options.deleteOutputPath
                ? this.deleteOutputDir(root, normalize(options.outputPath), this.context.host)
                : of(null)),
            concatMap(() => normalizeFileReplacements(options.fileReplacements, this.host, root)),
            tap(fileReplacements => options.fileReplacements = fileReplacements),
            concatMap(() => {
                const webpackConfig = this.buildNgServerWebpackConfig(root, projectRoot, this.host, options);
                return of(webpackConfig);
            }),
        );
    }

    buildNgServerWebpackConfig(
        root: Path,
        projectRoot: Path,
        host: virtualFs.Host<Stats>,
        options: BuildWebpackServerSchema
    ) {
        let wco: WebpackConfigOptions;
        const tsConfigPath = getSystemPath(normalize(resolve(root, normalize(options.tsConfig))));
        const tsConfig = readTsconfig(tsConfigPath);
        const projectTs = requireProjectModule(getSystemPath(projectRoot), 'typescript') as typeof ts;
        const supportES2015 = tsConfig.options.target !== projectTs.ScriptTarget.ES3
            && tsConfig.options.target !== projectTs.ScriptTarget.ES5;
        const buildOptions: typeof wco['buildOptions'] = {
            ...options as {} as typeof wco['buildOptions'],
        };
        wco = {
            root: getSystemPath(root),
            projectRoot: getSystemPath(projectRoot),
            buildOptions: {
                ...buildOptions,
                buildOptimizer: false,
                aot: true,
                platform: 'server',
                scripts: [],
                styles: [],
            },
            tsConfig,
            tsConfigPath,
            supportES2015,
        };
        wco.buildOptions.progress = defaultProgress(wco.buildOptions.progress);
        const webpackConfigs: {}[] = [
            getCommonConfig(wco),
            getServerConfig(wco),
            getStylesConfig(wco),
            getStatsConfig(wco),
        ];
        if (wco.buildOptions.main || wco.buildOptions.polyfills) {
            const typescriptConfigPartial = wco.buildOptions.aot
                ? getAotConfig(wco, host)
                : getNonAotConfig(wco, host);
            webpackConfigs.push(typescriptConfigPartial);
        }
        return webpackMerge(webpackConfigs);
    }

    buildNgBrowserWebpackConfig(
        root: Path,
        projectRoot: Path,
        host: virtualFs.Host<fs.Stats>,
        options: NormalizedBrowserBuilderSchema,
    ) {
        if (options.buildOptimizer && !options.aot) {
            throw new Error('The `--build-optimizer` option cannot be used without `--aot`.');
        }
        let wco: WebpackConfigOptions<NormalizedBrowserBuilderSchema>;
        const tsConfigPath = getSystemPath(normalize(resolve(root, normalize(options.tsConfig))));
        const tsConfig = readTsconfig(tsConfigPath);
        const projectTs = requireProjectModule(getSystemPath(projectRoot), 'typescript') as typeof ts;
        const supportES2015 = tsConfig.options.target !== projectTs.ScriptTarget.ES3
            && tsConfig.options.target !== projectTs.ScriptTarget.ES5;
        wco = {
            root: getSystemPath(root),
            projectRoot: getSystemPath(projectRoot),
            buildOptions: options,
            tsConfig,
            tsConfigPath,
            supportES2015,
        };
        wco.buildOptions.progress = defaultProgress(wco.buildOptions.progress);
        const webpackConfigs: {}[] = [
            getCommonConfig(wco),
            getBrowserConfig(wco),
            getStylesConfig(wco),
            getStatsConfig(wco),
        ];
        if (wco.buildOptions.main || wco.buildOptions.polyfills) {
            const typescriptConfigPartial = wco.buildOptions.aot
                ? getAotConfig(wco, host)
                : getNonAotConfig(wco, host);
            webpackConfigs.push(typescriptConfigPartial);
        }
        return webpackMerge(webpackConfigs);
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
                    '**/node_modules/**/*',
                    "**/.bin/**/*",
                    "**/.git/**/*",
                    '**/package.json',
                    "**/dist/**/*",
                    "**/publish/**/*",
                    "**/out-tsc/**/*",
                    "**/_/**/*",
                    "**/patch/**/*",
                    ".DS_Store",
                    "**/.git",
                    "**/_",
                    "**/dist",
                    "**/.git"
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
        })
    }
}
