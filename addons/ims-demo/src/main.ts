import { from } from 'rxjs';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
export const platform = from(platformBrowserDynamic().bootstrapModule(AppModule));
