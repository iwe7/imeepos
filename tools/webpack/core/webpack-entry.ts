import { WebpackConfig } from './webpack-config';
import { Entry } from 'webpack';

import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackEntry {
    private entry: Entry;

    constructor(
        private config: WebpackConfig
    ) { }

    set(name: string, value: string | string[]) {
        this.entry[name] = value;
    }

    get(): Entry {
        return this.entry;
    }
}
