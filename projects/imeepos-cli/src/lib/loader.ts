import { CommanderStatic } from 'commander';
import {
    AddCommand, InstallCommand,
    NewCommand, PublishCommand,
    StartCommand, TestCommand,
    GenerateCommand, DllCommand
} from './commands/index';
export class CommandLoader {
    static load(command: CommanderStatic) {
        new AddCommand().load(command);
        new InstallCommand().load(command);
        new NewCommand().load(command);
        new PublishCommand().load(command);
        new StartCommand().load(command);
        new TestCommand().load(command);
        new GenerateCommand().load(command);
        new DllCommand().load(command);
    }
}
