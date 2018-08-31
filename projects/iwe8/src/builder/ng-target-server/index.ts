import { concatMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BuilderContext, BuilderConfiguration } from '@angular-devkit/architect';
import { BuildWebpackServerSchema } from './schema';
import { WebpackBaseBuilder, WebapckBaseOption, WebpackMultOption } from '../base';
export class NgTargetServerBuilder extends WebpackBaseBuilder<BuildWebpackServerSchema> {
    constructor(public context: BuilderContext) {
        super(context);
    }
    getWebpackConfig(builderConfig: BuilderConfiguration<BuildWebpackServerSchema>): Observable<WebapckBaseOption> {
        const options = builderConfig.options;
        return this.getNgServerConfig(builderConfig).pipe(
            concatMap(cfg => {
                cfg.target = options.target;
                console.log(cfg.target);
                return of(new WebpackMultOption([cfg]))
            })
        );
    }
}

export default NgTargetServerBuilder;
