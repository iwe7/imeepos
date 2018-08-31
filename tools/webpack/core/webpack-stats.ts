import { Options } from 'webpack';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackStats {
    get(): Options.Stats {
        return {}
    }
}
