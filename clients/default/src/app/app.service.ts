import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    addons: any;
    constructor(
        public http: HttpClient
    ) { }

    get(name: string) {
        return this.addons[name] ? this.addons[name] : {};
    }

    async init() {
        return await this.http.get('./assets/addons.json').pipe(
            tap(res => {
                this.addons = res;
            })
        ).toPromise();
    }
}
