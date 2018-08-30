import { tap, map } from 'rxjs/operators';
import {
    BuilderContext,
    BuildEvent
} from '@angular-devkit/architect';
import { Observable, from, throwError } from 'rxjs';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import { defaultLoggingCb, LoggingCallback, WebpackMultOption, WebpackMultBuilder } from './webpack-mult';
import { NestFactory } from '@nestjs/core';
import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { normalize } from '@angular-devkit/core';
import * as  middleware from 'webpack-dev-middleware';
import { Options } from 'webpack-dev-middleware';

export class WebpackMultNestServerOption extends WebpackMultOption {
    constructor(
        configs: webpack.Configuration[],
        watch?: boolean,
        watchOptions?: webpack.MultiCompiler.WatchOptions,
        stats?: webpack.Stats,
        public devServer?: WebpackDevServer.Configuration,
        public app?: any,
        public middleware?: Options
    ) {
        super(configs, watch, watchOptions, stats);
    }
}
export class WebpackMultNestServerBuilder {
    webpack: WebpackMultBuilder;
    constructor(public context: BuilderContext) {
        this.webpack = new WebpackMultBuilder(context);
    }
    run(
        webpackConfig: WebpackMultNestServerOption,
        loggingCb: LoggingCallback = defaultLoggingCb,
    ): Observable<BuildEvent> {
        return new Observable(obs => {
            const devServerConfig = webpackConfig.devServer || {};
            devServerConfig.host = devServerConfig.host || 'localhost';
            devServerConfig.port = devServerConfig.port || 8080;
            const webpackCompiler: webpack.MultiCompiler | webpack.MultiCompiler = webpack(webpackConfig.configs);
            if (webpackCompiler instanceof webpack.MultiCompiler) {
                const { compilers } = webpackCompiler;
                compilers.map(compiler => {
                    compiler.hooks.done.tap('build-webpack', (stats) => {
                        loggingCb(stats, webpackConfig, this.context.logger);
                        obs.next({ success: !stats.hasErrors() });
                    });
                });
                let server: INestApplication & INestExpressApplication;
                const middlewareServer = middleware(webpackCompiler, webpackConfig.middleware);
                from(NestFactory.create(webpackConfig.app)).pipe(
                    tap(res => server = res),
                    tap(() => server.use(middlewareServer)),
                    tap(() => {
                        server.use('.html', (_, res, call) => {
                            this.context.host.read(normalize('index.html')).pipe(
                                map(buffer => buffer.toString()),
                                tap(html => call(null, html))
                            ).subscribe();
                        });
                    }),
                    tap(() => server.listen(devServerConfig.port, devServerConfig.host).catch((err) => {
                        throwError(err);
                    }))
                );
                return () => server.close();
            }
        });
    }
}
export default WebpackMultNestServerOption;
