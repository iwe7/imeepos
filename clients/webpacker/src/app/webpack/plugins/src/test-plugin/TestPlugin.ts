import { Plugin, Compiler, compilation, Stats } from 'webpack';
import { Tap } from 'tapable';

export class TestPlugin implements Plugin {
    compiler: Compiler;
    name: string = 'TestPlugin';
    hooks: string[];
    constructor() {
        this.hooks = [
            'shouldEmit', 'done', 'additionalPass',
            'beforeRun', 'run', 'emit', 'afterEmit',
            'thisCompilation', 'compilation',
            'normalModuleFactory', 'contextModuleFactory',
            'beforeCompile', 'compile', 'make',
            'afterCompile', 'watchRun', 'failed',
            'invalid', 'watchClose', 'environment', 'afterEnvironment',
            'afterPlugins', 'afterResolvers', 'entryOption'
        ];
    }

    apply(compiler: Compiler): void {
        this.compiler = compiler;
        if (compiler.hooks) {
            this.hooks.map(hook => this.tapHooks(hook));
        }
    }

    tapHooks(name: 'shouldEmit' | string) {
        if (this[name]) {
            this.compiler.hooks[name].tap(this.name, this[name])
        } else {
            this.compiler.hooks[name].tap(this.name, (...args: any[]) => {
                console.log(name, args);
            })
        }
    }
}
