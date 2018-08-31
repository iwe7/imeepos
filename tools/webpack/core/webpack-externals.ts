import { ExternalsElement } from 'webpack';

import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackExternals {
    get(): ExternalsElement[] {
        return [];
    }
}
