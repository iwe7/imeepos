import { createHash } from 'crypto';
import { WebpackEntryService } from './webpack-entry.service';
import { WebpackTargetService, TargetEnum } from './webpack-target.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as webpack from 'webpack';
import { TestPlugin } from './plugins/src/test-plugin/TestPlugin';
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
    });
    this.options = this.createEmptyConfiguration();
  }

  createEmptyConfiguration(): webpack.Configuration {
    return {
      target: TargetEnum.web,
      name: TargetEnum.web + '-' + Math.floor(Math.random() * 10000),
      mode: 'development',
      devtool: "source-map"
    }
  }

  run() {
    this.options.plugins = [
      new TestPlugin()
    ]
    webpack(this.options).run((err, stats) => {
      if (err) {
        console.error(err);
      }
      if (stats.hasErrors()) {
        console.error(stats.toJson().errors)
      }
      console.log('run success')
    });
  }
}


export class TestWebpackPlugin implements webpack.Plugin {
  apply(compiler: webpack.Compiler): void {
    compiler.hooks.entryOption.tap('TestWebpackPlugin', (context, entry) => {
      console.log(context, entry)
    });
    compiler.plugin('emit', (compilation, callback) => {
      compilation.chunks.forEach(function (chunk) {
        console.log('chunk', chunk);
        console.log('=====================================');
        console.log('chunk.modules', chunk.modules);
        if (chunk.modules) {
          // 每一个资源文件都会被编译成一个模块
          chunk.modules.forEach(function (module) {
            console.log('module', module.resource);
            module.fileDependencies.forEach(function (filepath) {
              console.log('filepath', filepath);
            });
          });
          chunk.files.forEach(function (filename) {
            let source = compilation.assets[filename].source();
            console.log('file', source);
          })
        }
      });
      console.log(compilation);
      callback();
    })
  }
}
