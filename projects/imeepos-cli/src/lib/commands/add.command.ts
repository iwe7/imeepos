import { tap } from 'rxjs/operators';
import { CommanderStatic, Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { AddAction, Input } from '../actions/index';
const add = new AddAction();
export class AddCommand extends AbstractCommand {
    constructor() {
        super(add);
    }
    public load(program: CommanderStatic): void {
        program
            .command('add <plugin> <version>')
            .alias('a')
            .description('安装插件')
            .action(async (plugin, version) => {
                const inputs: Input = new Map();
                const options: Input = new Map();
                inputs.set('plugin', plugin);
                inputs.set('version', version);
                await this.action.handle(inputs, options).pipe(
                    tap(res => console.log(res))
                ).toPromise();
            })
    }
}
