import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { from } from 'rxjs';
export const bootstrap = from(platformBrowserDynamic().bootstrapModule(AppModule));
