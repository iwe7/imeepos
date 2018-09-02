import { NestjsStarter } from './nestjs/bootstrap';
import { DialogService } from './electron/dialog.service';

import { Injectable } from '@angular/core';
import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as path from 'path';
@Injectable()
export class AppService {
    mainWindow: BrowserWindow;
    debug = /--debug/.test(process.argv[2])
    constructor(
        public dialog: DialogService,
        public nestjsStarter: NestjsStarter
    ) { }

    start() {
        console.log('app start');
        this.openWindow();
        this.dialog.start();
        this.nestjsStarter.start();
    }

    openWindow() {
        const windowOptions: BrowserWindowConstructorOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            title: app.getName(),
            frame: false,
            // webPreferences: {
            //     webSecurity: false,
            //     allowRunningInsecureContent: true,
            // },
        }
        if (process.platform === 'linux') {
            windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
        }
        this.mainWindow = new BrowserWindow(windowOptions)
        // this.mainWindow.loadURL('http://localhost:4200');
        this.mainWindow.loadURL(path.join('file://', __dirname, '../webpacker/index.html'))
        if (this.debug) {
            this.mainWindow.webContents.openDevTools()
            this.mainWindow.maximize()
            require('devtron').install()
        }
        this.mainWindow.on('closed', () => {
            this.mainWindow = null
        });
    }
}
