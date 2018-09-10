import { Configuration, DllReferencePlugin } from 'webpack';
import {
    BuilderConfiguration,
    BuilderContext,
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { BrowserBuilderSchema } from './schema';
import {
    WebpackBaseBuilder, WebpackMultOption,
    WebapckBaseOption, mainfast
} from '../base';

import { join } from 'path';
export class BrowserBuilder extends WebpackBaseBuilder<BrowserBuilderSchema> {
    constructor(public context: BuilderContext) {
        super(context);
    }
    getWebpackConfig(builderConfig: BuilderConfiguration<BrowserBuilderSchema>): Observable<WebapckBaseOption> {
        const options = builderConfig.options;
        const root = this.context.workspace.root;
        return this.getNgBrowserConfig(builderConfig).pipe(
            map((cfg: Configuration) => {
                // Entry
                cfg.entry = {
                    ...cfg.entry as any
                }
                // web node electron-render electron-main webworker
                cfg.output.libraryTarget = 'umd';
                // cfg.output.library = 'angular'
                cfg.target = options.target;
                // common
                // '.ts', '.tsx', '.mjs', '.js' '.json' '.html' '.css' '.scs' '.less'
                cfg.resolve.extensions.push('.json');
                cfg.resolve.extensions.push('.html');
                cfg.resolve.extensions.push('.css');
                cfg.resolve.extensions.push('.scss');
                cfg.resolve.extensions.push('.less');
                cfg.recordsPath = join(root, 'records.json');
                cfg.recordsInputPath = join(root, 'records.json');
                cfg.recordsOutputPath = join(root, 'records.json');
                cfg.optimization.portableRecords = true;
                cfg.optimization.occurrenceOrder = true;
                if (options.deps) {
                    options.deps.map(name => {
                        const json = require(join(root, mainfast, name, name + '.json'));
                        cfg.plugins.push(
                            new DllReferencePlugin({
                                context: mainfast,
                                manifest: json
                            })
                        );
                    });
                }
                return cfg;
            }),
            concatMap(cfg => {
                if (options.server) {
                    cfg.entry = {
                        ...cfg.entry as any,
                        server: join(root, options.server)
                    }
                }
                return of(new WebpackMultOption([cfg], options.watch, {}, this.getStats(false)))
            })
        )
    }
}
export default BrowserBuilder;
