import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';
import { PublishAction } from '../actions/index';
const publishAction = new PublishAction();
export class StartCommand extends AbstractCommand {
    constructor() {
        super(publishAction);
    }
    public load(program: CommanderStatic): void {
        program
            .command('start <port>')
            .alias('s')
            .description('启动应用')
            .action(async (path: string) => {
                const input = new Map();
                const options = new Map();
                this.action.handle(input, options);
            })
    }
}
