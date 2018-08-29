import { CommanderStatic } from 'commander';
import { AbstractCommand } from "./abstract.command";
import { InstallAction } from '../actions/index';
const install = new InstallAction();
export class InstallCommand extends AbstractCommand {
    constructor() {
        super(install);
    }
    public load(program: CommanderStatic): void {
        program
            .command('install')
            .alias('i')
            .description('安装系统')
            .action(async (name: string) => {
                const input = new Map();
                const options = new Map();
                this.action.handle(input, options);
            })
    }
}
