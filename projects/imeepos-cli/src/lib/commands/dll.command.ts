import { CommanderStatic } from 'commander';
import { AbstractCommand } from "./abstract.command";
import { DllAction } from '../actions/index';
const dll = new DllAction();
export class DllCommand extends AbstractCommand {
    constructor() {
        super(dll);
    }
    public load(program: CommanderStatic): void {
        program
            .command('dll')
            .alias('d')
            .description('提取dll')
            .action(async (name: string) => {
                const input = new Map();
                const options = new Map();
                await this.action.handle(input, options).toPromise();
            })
    }
}
