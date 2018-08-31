import { Entry } from 'webpack';
export declare class WebpackEntry {
    private entry;
    set(name: string, value: string | string[]): void;
    get(): Entry;
}
export declare const webpackEntry: WebpackEntry;
