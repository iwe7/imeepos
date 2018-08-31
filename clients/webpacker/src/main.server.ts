import "zone.js/dist/zone-node"
import { AppServerModule } from './server/app.module';
import { platformDynamicServer } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { from } from 'rxjs';
import { app } from 'electron';
import { tap } from 'rxjs/operators';
if (app) {
    let mainWindow = null
    if (environment.production) {
        enableProdMode();
    }
    app.on('ready', () => {
        createWindow()
    });
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });
    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow()
        }
    });

} else {
    createWindow();
}
let platformRef: any;
function createWindow() {
    if (!platformRef) {
        from(platformDynamicServer().bootstrapModule(AppServerModule)).pipe(
            tap(ref => platformRef = ref)
        ).subscribe();
    }
}
