import { Observable, of, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

import { Builder, BuilderConfiguration, BuildEvent, BuilderContext } from '@angular-devkit/architect';
import { main, NgcParsedConfiguration } from '../../ngc-compiler/ngc-compiler';
export interface NgcSchema {
    watch?: boolean;
    project: string;
}

export class NgcBuilder implements Builder<NgcSchema>{
    constructor(public context: BuilderContext) { }
    run(builderConfig: BuilderConfiguration<NgcSchema>): Observable<BuildEvent> {
        const options: NgcParsedConfiguration = builderConfig.options as NgcParsedConfiguration;
        return this.start(options).pipe(
            map((res: string) => {
                this.context.logger.info(res);
                return { success: true }
            })
        );
    }

    start(options: NgcSchema) {
        const args: string[] = [];
        args.push('-p')
        args.push(options.project)
        if (options.watch) {
            args.push('-w')
        }
        return Observable.create((obser: Observer<any>) => {
            main(args, (s: string) => {
                obser.next(s);
                if (!options.watch) {
                    obser.complete();
                }
            });
        });
    }
}

export default NgcBuilder;
