import { switchMap, map } from 'rxjs/operators';
import { BrowserBuilderSchema } from '@angular-devkit/build-angular/src/browser/schema';
import { BuilderContext, BuilderConfiguration } from '@angular-devkit/architect';
import {
    WebpackBaseBuilder, WebapckBaseOption,
    WebpackMultOption, mainfast
} from '../base';
import { Observable } from 'rxjs';
import * as webpack from 'webpack';
import { join } from 'path';

export class NgBuilderOption {
    constructor(
        public ngTarget: string,
        public isDll: boolean,
        public name: string
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
                config.output.library = 'imeepos_[name]';
                if (options.isDll) {
                    config.output.path = join(root, '_/tmp');
                    config.plugins.push(
                        new webpack.DllPlugin({
                            path: join(root, mainfast, options.name, 'mainfast.json'),
                            name: 'imeepos_[name]',
                            context: mainfast + '/' + options.name
                        })
                    );
                    return new WebpackMultOption([config], false, {}, this.getStats(true))
                } else {
                    config.output.path = join(root, mainfast, options.name);
                    return new WebpackMultOption([config], false, {}, this.getStats(true))
                }
            })
        );
    }
}

export default NgBuilder;
