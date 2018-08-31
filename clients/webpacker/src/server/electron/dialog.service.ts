import { Injectable } from '@angular/core';
import { dialog, ipcMain } from 'electron';
@Injectable()
export class DialogService {
  start() {
    ipcMain.on('open-file-dialog', (event) => {
      dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
      }, (files) => {
        if (files) {
          event.sender.send('open-file-dialog-success', files)
        }
      })
    })
  }
}
