import { Resolve } from 'webpack';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackResolve {
    get(): Resolve {
        return {
            extensions: [".js", ".css", ".json"],
            alias: {}
        };
    }
}
