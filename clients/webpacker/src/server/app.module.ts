import { AppService } from './app.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        BrowserModule
    ],
    providers: [
        AppService
    ]
})
export class AppServerModule {
    constructor(
        public app: AppService
    ) { }

    ngDoBootstrap() {
        this.app.start();
    }
}
