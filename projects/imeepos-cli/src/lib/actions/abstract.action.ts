import { Observable } from 'rxjs';

export type Input = Map<string, string>;

export abstract class AbstractAction {
    public abstract handle(inputs?: Input, options?: Input): Observable<any>;
}
