import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackConfig {
    root: string = process.cwd()
}
