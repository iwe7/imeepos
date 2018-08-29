import { CommanderStatic } from 'commander';

import { AbstractCommand } from './abstract.command';
import { NewAction } from '../actions/index';
const newAction = new NewAction();
export class NewCommand extends AbstractCommand {
    constructor() {
        super(newAction);
    }
    public load(program: CommanderStatic): void {
        program
            .command('new <name>')
            .alias('n')
            .description('新建应用')
            .action(async (name: string) => {
                const input = new Map();
                const options = new Map();
                input.set('name', name);
                console.log('新建应用');
                await this.action.handle(input, options).toPromise();
            })
    }
}
