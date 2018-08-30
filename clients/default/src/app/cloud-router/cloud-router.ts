import { AppService } from './../app.service';
import { Component, OnInit, ɵglobal as global, Inject } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
@Component({
    selector: 'cloud-router',
    templateUrl: './cloud-router.html'
})
export class CloudRouterComponent implements OnInit {
    constructor(
        private router: Router,
        private active: ActivatedRoute,
        @Inject(DOCUMENT)
        private document: any,
        public app: AppService
    ) {
        this.active.url.subscribe(path => {
            this.getPath(path);
        });
    }

    ngOnInit() { }

    getPath(path: UrlSegment[]) {
        const paths = path.map(res => res.path);
        this.loader(paths[0]).subscribe(res => {
            console.log(res);
        });
    }

    loader(name: string) {
        return Observable.create(obser => {
            const src = this.app.get(name).main;
            if (src) {
                const script: HTMLScriptElement = this.document.createElement('script');
                script.src = this.app.get(name).main;
                script.onload = (ev: Event) => {
                    if (global && global[`${name}_main`]) {
                        obser.next(global[`${name}_main`]);
                    } else {
                        obser.error('参数错误');
                    }
                    obser.complete();
                }
                script.onerror = (ev: ErrorEvent) => {
                    obser.error(ev);
                }
                this.document.head.appendChild(script);
            } else {
                obser.error('参数错误');
            }
        })
    }
}
