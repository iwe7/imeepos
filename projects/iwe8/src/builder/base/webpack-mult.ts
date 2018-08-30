import {
    BuildEvent,
    BuilderContext,
} from '@angular-devkit/architect';
import { logging } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import * as webpack from 'webpack';

export interface LoggingCallback {
    (stats: webpack.Stats, config: any, logger: logging.Logger): void;
}

export const defaultLoggingCb: LoggingCallback = (stats, config, logger) =>
    logger.info(stats.toString(config.stats));

export class WebpackMultOption {
    constructor(
        public configs: webpack.Configuration[],
        public watch?: boolean,
        public watchOptions?: webpack.MultiCompiler.WatchOptions,
        public stats?: webpack.Stats
    ) { }
}

export class WebpackMultBuilder {
    constructor(public context: BuilderContext) { }
    public run(
        config: WebpackMultOption,
        loggingCb = defaultLoggingCb,
    ): Observable<BuildEvent> {
        return new Observable(obs => {
            const webpackCompiler: webpack.MultiWatching | webpack.MultiCompiler = webpack(config.configs);
            if (webpackCompiler instanceof webpack.MultiCompiler) {
                const callback: webpack.MultiCompiler.Handler = (err, stats) => {
                    if (err) {
                        return obs.error(err);
                    }
                    loggingCb(stats, config, this.context.logger);
                    obs.next({ success: !stats.hasErrors() });
                    if (!config.watch) {
                        obs.complete();
                    }
                };
                try {
                    if (config.watch) {
                        const watchOptions = config.watchOptions || {};
                        const watching = webpackCompiler.watch(watchOptions, callback);
                        return () => watching.close(() => { });
                    } else {
                        webpackCompiler.run(callback);
                    }
                } catch (err) {
                    if (err) {
                        this.context.logger.error('\nAn error occured during the build:\n' + ((err && err.stack) || err));
                    }
                    throw err;
                }
            }
        });
    }
}

export default WebpackMultBuilder;
