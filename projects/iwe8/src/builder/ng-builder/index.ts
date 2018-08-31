import { switchMap, map } from 'rxjs/operators';
import { BrowserBuilderSchema } from '@angular-devkit/build-angular/src/browser/schema';
import { BuilderContext, BuilderConfiguration } from '@angular-devkit/architect';
import {
    WebpackBaseBuilder, WebapckBaseOption,
    WebpackMultOption, mainfast, getMainContext
} from '../base';
import { Observable } from 'rxjs';
import * as webpack from 'webpack';
import { join } from 'path';

export class NgBuilderOption {
    constructor(
        public ngTarget: string,
        public isDll: boolean,
        public name: string,
        public deps: string[]
    ) { }
}
export class NgBuilder extends WebpackBaseBuilder<NgBuilderOption> {
    constructor(public context: BuilderContext) {
        super(context);
    }
    getWebpackConfig(builderConfig: BuilderConfiguration<NgBuilderOption>): Observable<WebapckBaseOption> {
        const options = builderConfig.options;
        const { ngTarget } = options;
        const ngConfiguration = this.buildTarget<BrowserBuilderSchema>(ngTarget);
        return ngConfiguration.pipe(
            switchMap(cfg => {
                return this.getNgBrowserConfig(cfg);
            }),
            map((config: webpack.Configuration) => {
                const root = this.context.workspace.root;
                if (options.deps) {
                    options.deps.map(name => {
                        const json = require(join(root, mainfast, name, name + '.json'));
                        config.plugins.push(
                            new webpack.DllReferencePlugin({
                                context: mainfast,
                                manifest: json
                            })
                        );
                    })
                }
                return new WebpackMultOption([config], true, {}, this.getStats(true))
            })
        );
    }
}

export default NgBuilder;
