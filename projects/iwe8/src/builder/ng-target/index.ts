import { Configuration } from 'webpack';
import {
    BuilderConfiguration,
    BuilderContext,
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { BrowserBuilderSchema } from './schema';
import {
    WebpackBaseBuilder, WebpackMultOption,
    WebapckBaseOption
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
                // web node electron-render electron-main webworker
                cfg.target = options.target;
                // '.ts', '.tsx', '.mjs', '.js' '.json'
                cfg.resolve.extensions.push('.json');
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
