import { Observable } from 'rxjs';
import { AbstractAction, Input } from './abstract.action';
import { compilerTemplate, registerInput, registerOption } from 'iwe8/compiler';
import { join, normalize, relative, Path } from '@angular-devkit/core';
export class GenerateAction extends AbstractAction {
    public handle(input: Input, option: Input): Observable<any> {
        registerInput(input);
        registerOption(option);
        const name = input.get('name');
        let output = input.get('output');
        if (!output) {
            output = output || 'src/addons'
        }
        if (!name) {
            throw new Error('name 不能为空');
        }
        const filePath = normalize(__dirname);
        return compilerTemplate(join(__dirname as Path, `../schematics/${name}/index#default`), `src/addons/${output}`);
    }
}
