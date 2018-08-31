import { switchMap } from 'rxjs/operators';
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
    BuildEvent,
    Builder,
    BuilderConfiguration,
    BuilderContext,
} from '@angular-devkit/architect';
import { LoggingCallback, WebpackBuilder } from '@angular-devkit/build-webpack';
import { Path, getSystemPath, normalize, resolve, virtualFs, join } from '@angular-devkit/core';
import * as fs from 'fs';
import { Observable, concat, of, throwError } from 'rxjs';
import { concatMap, last, tap, map } from 'rxjs/operators';
import * as ts from 'typescript'; // tslint:disable-line:no-implicit-dependencies
import { WebpackConfigOptions } from '@angular-devkit/build-angular/src/angular-cli-files/models/build-options';
import {
    getAotConfig,
    getBrowserConfig,
    getCommonConfig,
    getNonAotConfig,
    getStatsConfig,
    getStylesConfig,
} from '@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs';
import { readTsconfig } from '@angular-devkit/build-angular/src/angular-cli-files/utilities/read-tsconfig';
import { requireProjectModule } from '@angular-devkit/build-angular/src/angular-cli-files/utilities/require-project-module';
import { augmentAppWithServiceWorker } from '@angular-devkit/build-angular/src/angular-cli-files/utilities/service-worker';
import {
    statsErrorsToString,
    statsToString,
    statsWarningsToString,
} from '@angular-devkit/build-angular/src/angular-cli-files/utilities/stats';
import { defaultProgress, normalizeAssetPatterns, normalizeFileReplacements } from '@angular-devkit/build-angular/src/utils';
import { AssetPatternObject, BrowserBuilderSchema, CurrentFileReplacement } from './schema';
const webpackMerge = require('webpack-merge');
import * as webpack from 'webpack';
import { DllBuilder } from '../dll';

export interface NormalizedBrowserBuilderSchema extends BrowserBuilderSchema {
    assets: AssetPatternObject[];
    fileReplacements: CurrentFileReplacement[];
}

export class BrowserBuilder implements Builder<BrowserBuilderSchema> {

    webpackBuilder: WebpackBuilder;
    host: virtualFs.Host<fs.Stats>;
    dll: DllBuilder;
    constructor(public context: BuilderContext, host?: virtualFs.Host<fs.Stats>) {
        this.host = host || new virtualFs.AliasHost(this.context.host as virtualFs.Host<fs.Stats>);
        this.dll = new DllBuilder(context);
        this.webpackBuilder = new WebpackBuilder({ ...this.context, host: this.host });
    }

    run(builderConfig: BuilderConfiguration<BrowserBuilderSchema>): Observable<BuildEvent> {
        const options = builderConfig.options;
        const root = this.context.workspace.root;
        const projectRoot = resolve(root, builderConfig.root);

        return this.getWebpackConfig(builderConfig).pipe(
            switchMap(cfg => {
                return this.webpackBuilder.runWebpack(cfg, getBrowserLoggingCb(options.verbose));
            }),
            concatMap(buildEvent => {
                if (buildEvent.success && !options.watch && options.serviceWorker) {
                    return new Observable(obs => {
                        augmentAppWithServiceWorker(
                            this.context.host,
                            root,
                            projectRoot,
                            resolve(root, normalize(options.outputPath)),
                            options.baseHref || '/',
                            options.ngswConfigPath,
                        ).then(
                            () => {
                                obs.next({ success: true });
                                obs.complete();
                            },
                            (err: Error) => {
                                obs.error(err);
                            },
                        );
                    });
                } else {
                    return of(buildEvent);
                }
            }),
        );
    }

    getWebpackConfig(builderConfig: BuilderConfiguration<BrowserBuilderSchema>): Observable<webpack.Configuration> {
        const options = builderConfig.options;
        const root = this.context.workspace.root;
        const projectRoot = resolve(root, builderConfig.root);
        return of(null).pipe(
            concatMap(() => options.deleteOutputPath
                ? this._deleteOutputDir(root, normalize(options.outputPath), this.context.host)
                : of(null)),
            concatMap(() => normalizeFileReplacements(options.fileReplacements, this.host, root)),
            tap(fileReplacements => options.fileReplacements = fileReplacements),
            concatMap(() => normalizeAssetPatterns(
                options.assets, this.host, root, projectRoot, builderConfig.sourceRoot)
            ),
            tap((assetPatternObjects => options.assets = assetPatternObjects)),
            map(() => {
                let webpackConfig;
                try {
                    webpackConfig = this.buildWebpackConfig(root, projectRoot, this.host,
                        options as NormalizedBrowserBuilderSchema);
                } catch (e) {
                    return throwError(e);
                }
                webpackConfig.target = 'electron-renderer';
                webpackConfig.resolve.extensions.push('.json');
                return webpackConfig;
            })
        );
    }

    private buildTarget<T = any>(path: string, overrides: any = {}): BuilderConfiguration<T> {
        const architect = this.context.architect;
        const [project, target, configuration] = path.split(':');
        const builderConfig = architect.getBuilderConfiguration<T>({
            project,
            target,
            configuration,
            overrides,
        });
        return builderConfig;
    }

    buildWebpackConfig(
        root: Path,
        projectRoot: Path,
        host: virtualFs.Host<fs.Stats>,
        options: NormalizedBrowserBuilderSchema,
    ) {
        // Ensure Build Optimizer is only used with AOT.
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
        const webpackConfig = webpackMerge(webpackConfigs);
        return webpackConfig;
    }

    private _deleteOutputDir(root: Path, outputPath: Path, host: virtualFs.Host) {
        const resolvedOutputPath = resolve(root, outputPath);
        if (resolvedOutputPath === root) {
            throw new Error('Output path MUST not be project root directory!');
        }

        return host.exists(resolvedOutputPath).pipe(
            concatMap(exists => exists
                // TODO: remove this concat once host ops emit an event.
                ? concat(host.delete(resolvedOutputPath), of(null)).pipe(last())
                // ? of(null)
                : of(null)),
        );
    }
}

export const getBrowserLoggingCb = (verbose: boolean): LoggingCallback =>
    (stats, config, logger) => {
        // config.stats contains our own stats settings, added during buildWebpackConfig().
        const json = stats.toJson(config.stats);
        if (verbose) {
            logger.info(stats.toString(config.stats));
        } else {
            logger.info(statsToString(json, config.stats));
        }
        if (stats.hasWarnings()) {
            logger.warn(statsWarningsToString(json, config.stats));
        }
        if (stats.hasErrors()) {
            logger.error(statsErrorsToString(json, config.stats));
        }
    };

export default BrowserBuilder;
