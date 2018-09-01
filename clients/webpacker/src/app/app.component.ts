import { TsService } from './typescript/ts.service';
import { RenderDialogService } from './electron-render/dialog.service';
import { WebpackEntryService } from './webpack/webpack-entry.service';
import { WebpackService } from './webpack/webpack.service';
import { Component } from '@angular/core';
import * as webpack from 'webpack';
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

  compiler() {
    console.log(this.ts);
    const source = this.ts.getSourceFile();
    console.log(source);
    source.forEachChild((node) => {
      // console.log(node);
    })
  }

  addEntry() {
    this.entry.addEntry('main').subscribe();
  }

  run() {
    this.webpack.run();
  }
}
