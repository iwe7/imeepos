import { WebpackEntryService } from './webpack-entry.service';
import { WebpackTargetService, TargetEnum } from './webpack-target.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as webpack from 'webpack';

@Injectable({
  providedIn: 'root'
})
export class WebpackService {
  options: webpack.Configuration = {};
  _output: Subject<any> = new Subject();

  constructor(
    public target: WebpackTargetService,
    public entry: WebpackEntryService
  ) {
    this.entry.update.subscribe(res => {
      this.options.entry = res;
      console.log(this.options);
    });
  }

  createEmptyConfiguration(): webpack.Configuration {
    return {
      target: TargetEnum.web,
      name: TargetEnum.web + '-' + Math.floor(Math.random() * 10000),
      mode: 'development'
    }
  }
}
