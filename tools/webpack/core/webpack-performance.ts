import { Options } from 'webpack';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackPerformance {

    get(): Options.Performance {
        return {}
    }
}
