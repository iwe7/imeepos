import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';
import { PublishAction } from '../actions/index';
const publishAction = new PublishAction();
export class PublishCommand extends AbstractCommand {
    constructor() {
        super(publishAction);
    }
    public load(program: CommanderStatic): void {
        program
            .command('publish <path>')
            .alias('p')
            .description('发布应用')
            .action(async (path: string) => {
                const input = new Map();
                const options = new Map();
                this.action.handle(input, options);
            })
    }
}
