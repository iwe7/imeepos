import { Webpack } from './core/webpack';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
@NgModule({
    providers: []
})
export class WebpackModule { }

platformBrowserDynamic().bootstrapModule(WebpackModule).then(ref => {
    const webpack = ref.injector.get(Webpack);
    const config = webpack.get();
})
