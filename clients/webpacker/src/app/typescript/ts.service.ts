import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Injectable } from '@angular/core';
import * as rxjs from 'rxjs';
import * as webpack from 'webpack';

@Injectable({
    providedIn: "root"
})
export class TsService {
    host: ts.CompilerHost;
    ts = ts;
    rxjs = rxjs;
    webpack = webpack;
    constructor() {
        const options = JSON.parse(readFileSync(join(__dirname, 'assets/src/tsconfig.json')).toString());
        this.host = ts.createCompilerHost(options);
    }
    getSourceFile(): ts.SourceFile {
        return this.host.getSourceFile(join(__dirname, 'assets/src/test2.ts'), ts.ScriptTarget.ES5);
    }

    get compiler(): webpack.Compiler {
        return new this.webpack.Compiler();
    }
}
