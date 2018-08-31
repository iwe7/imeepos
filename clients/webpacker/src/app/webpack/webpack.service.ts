import { WebpackEntryService } from './webpack-entry.service';
import { WebpackTargetService, TargetEnum } from './webpack-target.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as webpack from 'webpack';

@Injectable({
  providedIn: 'root'
})
export class WebpackService {
  options: webpack.Configuration[] = [];

  optionsMap: Map<string, webpack.Configuration> = new Map();
  watchOptions: webpack.MultiCompiler.WatchOptions;
  compiler: webpack.MultiCompiler | webpack.MultiWatching;
  _output: Subject<any> = new Subject();

  constructor(
    public target: WebpackTargetService,
    public entry: WebpackEntryService
  ) { }

  addConfiguration(option: webpack.Configuration) {
    option.name = option.name || new Date().getTime() + '';
    this.optionsMap.set(option.name, option);
  }

  createEmptyConfiguration(): webpack.Configuration {
    return {
      target: TargetEnum.web,
      name: TargetEnum.web + '-' + Math.floor(Math.random() * 10000),
      mode: 'development'
    }
  }

  // 创建compiler
  create(): webpack.MultiCompiler | webpack.MultiWatching {
    if (this.compiler) {
      return this.compiler;
    } else {
      this.compiler = webpack(this.options, (err: Error, stats: webpack.Stats) => {
        if (err) {
          this._output.error(err);
        }
        this._output.next(stats);
      });
      return this.compiler;
    }
  }

  createAndWatch() {
    const compiler = this.create();
    if (compiler instanceof webpack.MultiCompiler) {
      compiler.watch(this.watchOptions, (err: Error, stats: webpack.Stats) => {
        if (err) {
          this._output.error(err);
        } else {
          this._output.next(stats);
        }
      });
    }
  }

  createAndRun() {
    const compiler = this.create();
    if (compiler instanceof webpack.MultiCompiler) {
      compiler.run((err: Error, stats: webpack.Stats) => {
        if (err) {
          this._output.error(err);
        } else {
          this._output.next(stats);
        }
      });
    }
  }
}
