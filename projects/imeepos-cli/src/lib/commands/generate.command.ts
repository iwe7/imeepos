import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';
import { GenerateAction } from '../actions/index';
const generateAction = new GenerateAction();
export class GenerateCommand extends AbstractCommand {
    constructor() {
        super(generateAction);
    }
    public load(program: CommanderStatic): void {
        program
            .command('generate <name> <output>')
            .alias('g')
            .description('新建模板')
            .action(async (name: string, output: string) => {
                const input = new Map();
                input.set('name', name);
                input.set('output', output);
                const options = new Map();
                await this.action.handle(input, options).toPromise();
            })
    }
}
