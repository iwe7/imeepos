
import { NestFactory } from '@nestjs/core';
import { Injectable } from '@angular/core';
import { Application } from './application';

@Injectable({
    providedIn: "root"
})
export class NestjsStarter {
    start() {
        NestFactory.create(Application).then(app => {
            app.enableCors();
            app.listen(8081).then(() => console.log('app start at 8081'))
        })
    }
}
