import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class RenderDialogService {
  constructor() {
  }

  selectFile(): Observable<string[]> {
    return Observable.create((obser: Observer<string[]>) => {
      ipcRenderer.send('open-file-dialog');
      ipcRenderer.on('open-file-dialog-success', (event, data) => {
        obser.next(data);
        obser.complete();
      });
    });
  }
}
