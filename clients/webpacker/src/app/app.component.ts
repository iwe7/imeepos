import { TsService } from './typescript/ts.service';
import { RenderDialogService } from './electron-render/dialog.service';
import { WebpackEntryService } from './webpack/webpack-entry.service';
import { WebpackService } from './webpack/webpack.service';
import { Component } from '@angular/core';
import * as webpack from 'webpack';
import { SocketService } from './socket/socket.service';
import { catchError } from 'rxjs/operators';
// import { connect } from './models/socket.io2/src/index';
// import { Socket } from './models/socket.io2/src/index';

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
    private ts: TsService,
    public socketService: SocketService
  ) {
    this.option = this.webpack.createEmptyConfiguration();
  }

  compiler() { }

  addEntry() {
    this.entry.addEntry('main').pipe(
      catchError((err, res) => {
        if (err) {
          console.log(err);
          return res;
        } else {
          return res;
        }
      })
    ).subscribe();
  }
  connect() {
    this.socketService.connect().subscribe();
  }

  send() {
    this.socketService.send('test');
  }

  run() {
    this.webpack.run();
  }
}
