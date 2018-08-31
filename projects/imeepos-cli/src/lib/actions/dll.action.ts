import { Observable } from 'rxjs';
import { AbstractAction, Input } from './abstract.action';
import * as  path from 'path';
import * as  fs from 'fs';
import * as webpack from 'webpack';
import { getWebpackStatsConfig } from '@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs';
const root = process.cwd();
/**
 * 尽量减小搜索范围
 * target: '_dll_[name]' 指定导出变量名字
 */
export class DllAction extends AbstractAction {
    handle(input: Input, option: Input): Observable<any> {
        return Observable.create(obser => {
            const cfg = this.getConfig();
            const compiler = webpack(cfg);
            compiler.run((err, stats) => {
                if (err) {
                    console.log(err);
                }
                console.log(stats.toJson(getWebpackStatsConfig(false)));
                obser.next(stats);
                obser.complete();
            });
        });
    }

    getPackage() {
        return JSON.parse(
            fs.readFileSync(
                path.join(root, 'package.json')
            ).toString()
        );
    }

    getConfig() {
        return {
            context: root,
            mode: "production",
            target: "node",
            entry: {
                vendor: [
                    "@angular/core",
                    "@angular/common",
                    "@angular/common/http",
                    "@angular/forms",
                    "@angular/router",
                    "@angular/compiler",
                    "@angular/platform-browser",
                    "@angular/platform-browser-dynamic",
                    "ng-zorro-antd",
                    "@angular/elements"
                ]
            },
            output: {
                path: path.join(root, '_/library'),
                filename: '[name].dll.js',
                library: '_dll_[name]'
            },
            // manifest是描述文件
            plugins: [
                new webpack.DllPlugin({
                    name: '_dll_[name]',
                    path: path.join(root, '_/library', 'manifest.json'),
                    context: '.'
                })
            ]
        } as any;
    }

}
