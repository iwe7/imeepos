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
    public entry: WebpackEntryService
  ) {
    this.option = this.webpack.createEmptyConfiguration();
  }
}
