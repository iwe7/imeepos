import { Module, RuleSetRule } from 'webpack';
export declare class WebpackModule {
    private root;
    rules: RuleSetRule[];
    rulesMap: Map<string, RuleSetRule>;
    constructor(root: string);
    get(): Module;
    addTsRule(): void;
}
