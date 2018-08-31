import { Configuration } from 'webpack';
export declare class WebpackPage {
    private root;
    private index;
    private scripts;
    constructor(root: string);
    get(): Configuration;
}
