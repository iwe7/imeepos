import {
    BuilderContext,
    BuildEvent
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import { defaultLoggingCb, LoggingCallback, WebpackMultOption, WebpackMultBuilder } from './webpack-mult';
export class WebpackMultDevServerOption extends WebpackMultOption {
    constructor(
        configs: webpack.Configuration[],
        watch?: boolean,
        watchOptions?: webpack.MultiCompiler.WatchOptions,
        stats?: webpack.Stats,
        public devServer?: WebpackDevServer.Configuration
    ) {
        super(configs, watch, watchOptions, stats);
    }
}
export class WebpackMultDevServerBuilder {
    webpack: WebpackMultBuilder;
    constructor(public context: BuilderContext) {
        this.webpack = new WebpackMultBuilder(context);
    }
    run(
        webpackConfig: WebpackMultDevServerOption,
        loggingCb: LoggingCallback = defaultLoggingCb,
    ): Observable<BuildEvent> {
        return new Observable(obs => {
            const devServerConfig = webpackConfig.devServer || {};
            devServerConfig.host = devServerConfig.host || 'localhost';
            devServerConfig.port = devServerConfig.port || 8080;
            const webpackCompiler: webpack.MultiCompiler | webpack.MultiCompiler = webpack(webpackConfig.configs);
            if (webpackCompiler instanceof webpack.MultiCompiler) {
                const server = new WebpackDevServer(webpackCompiler, devServerConfig);
                const { compilers } = webpackCompiler;
                compilers.map(compiler => {
                    compiler.hooks.done.tap('build-webpack', (stats) => {
                        loggingCb(stats, webpackConfig, this.context.logger);
                        obs.next({ success: !stats.hasErrors() });
                    });
                });
                server.listen(
                    devServerConfig.port,
                    devServerConfig.host,
                    (err) => {
                        if (err) {
                            obs.error(err);
                        }
                    }
                );
                return () => server.close();
            }
        });
    }
}
export default WebpackMultDevServerBuilder;
