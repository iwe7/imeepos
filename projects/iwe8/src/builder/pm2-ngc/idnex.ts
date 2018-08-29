import { Builder, BuildEvent, BuilderConfiguration } from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
export interface Pm2NgcSchema {
    tsConfig: string;
}
export class Pm2NgcBuilder implements Builder<Pm2NgcSchema>{
    run(builderConfig: BuilderConfiguration<Pm2NgcSchema>): Observable<BuildEvent> {
        const options = builderConfig.options;
        const { tsConfig } = options;
        return of({ success: true });
    }
}
