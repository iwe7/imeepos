import { Observable, of } from 'rxjs';
import { AbstractAction, Input } from './abstract.action';
import { iwe7Template } from 'iwe8/template';
import { normalize, join, Path } from '@angular-devkit/core';
export class NewAction extends AbstractAction {
    constructor() {
        super();
    }
    handle(input?: Input, option?: Input): Observable<any> {
        let name = input.get('name');
        if (!name) {
            name = 'default';
            input.set('name', name);
        }
        const options: any = {};
        input.forEach((o, i) => {
            options[i] = o;
        });
        option.forEach((o, i) => {
            options[i] = o;
        });
        const filePath =
            join(__dirname as Path, `../schematics/new`);
        console.log('building: ' + name);
        return iwe7Template(
            filePath,
            `${name}`,
            options
        );
    }
}
