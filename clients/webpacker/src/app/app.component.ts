import { TsService } from './typescript/ts.service';
import { RenderDialogService } from './electron-render/dialog.service';
import { WebpackEntryService } from './webpack/webpack-entry.service';
import { WebpackService } from './webpack/webpack.service';
import { Component } from '@angular/core';
import * as webpack from 'webpack';
// import * as socket from 'socket.io-client';
const io = require('socket.io-client');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  option: webpack.Configuration;
  constructor(
    public webpack: WebpackService,
    public entry: WebpackEntryService,
    public dialog: RenderDialogService,
    private ts: TsService
  ) {
    this.option = this.webpack.createEmptyConfiguration();
  }

  compiler() { }

  addEntry() {
    this.entry.addEntry('main').subscribe();
  }

  connect() {
    const socket = io('http://localhost:8081');
    socket.on('connect', function () {
      console.log('Connected');
      socket.emit('events', { test: 'test' });
    });
    socket.on('events', function (data) {
      console.log('event', data);
    });
    socket.on('exception', function (data) {
      console.log('event', data);
    });
    socket.on('disconnect', function () {
      console.log('Disconnected');
    });
    console.log(socket);
  }

  run() {
    this.webpack.run();
  }
}
