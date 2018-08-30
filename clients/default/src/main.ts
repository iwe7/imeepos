import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { from } from 'rxjs';
if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule).catch((err: Error) => {
    console.log(err);
  });
});

export { AppModule };
export { AppComponent } from './app/app.component';
export { CloudRouterComponent } from './app/cloud-router/cloud-router';
