import { Observable, of } from 'rxjs';
import { AbstractAction, Input } from './abstract.action';
export class InstallAction extends AbstractAction {
    constructor() {
        super();
    }
    handle(inputs?: Input, options?: Input): Observable<any> {
        return of(null);
    }
}
