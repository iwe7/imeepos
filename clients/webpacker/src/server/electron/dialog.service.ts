import { Injectable } from '@angular/core';
import { OpenDialogOptions, ipcRenderer } from 'electron';
@Injectable()
export class DialogService {
  constructor() {

  }
  showOpenDialog(options: OpenDialogOptions) {
    ipcRenderer.send('open-file-dialog', options);
  }
}
