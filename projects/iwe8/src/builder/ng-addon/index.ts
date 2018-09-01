import { concatMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BuilderContext, BuilderConfiguration } from '@angular-devkit/architect';
import { BuildWebpackServerSchema } from './schema';
import { WebpackBaseBuilder, WebapckBaseOption, WebpackMultOption } from '../base';
import { Configuration } from 'webpack';
export class NgTargetServerBuilder extends WebpackBaseBuilder<BuildWebpackServerSchema> {
    constructor(public context: BuilderContext) {
        super(context);
    }
    getWebpackConfig(builderConfig: BuilderConfiguration<BuildWebpackServerSchema>): Observable<WebapckBaseOption> {
        const options = builderConfig.options;
        return this.getNgServerConfig(builderConfig).pipe(
            concatMap((cfg: Configuration) => {
                cfg.target = options.target;
                // 修复
                cfg.output.libraryTarget = 'umd';
                cfg.node = false;
                return of(new WebpackMultOption([cfg]))
            })
        );
    }
}

export default NgTargetServerBuilder;
