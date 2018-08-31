import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrap } from './entry';
if (environment.production) {
  enableProdMode();
}
document.addEventListener('DOMContentLoaded', () => {
  bootstrap.toPromise().catch((err: Error) => {
    console.log(err);
  });
});
