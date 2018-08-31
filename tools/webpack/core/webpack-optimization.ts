import { Options } from 'webpack';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackOptimization {
    get(): Options.Optimization {
        return {};
    }
}
