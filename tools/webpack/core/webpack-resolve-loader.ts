import { ResolveLoader } from 'webpack';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackResolveLoader {

    get(): ResolveLoader {
        return {}
    }
}
