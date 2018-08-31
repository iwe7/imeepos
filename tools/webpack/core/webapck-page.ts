import { WebpackStyles } from './webpack-styles';
import { WebpackEntry, webpackEntry } from './webpack-entry';
import { Configuration } from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';

export class WebpackPage {
    // html首页
    private index: string;
    private scripts: WebpackEntry;
    constructor(private root: string) { }
    get(): Configuration {
        return {
            entry: this.scripts.get(),
            plugins: [
                new HtmlWebpackPlugin({
                    template: path.resolve(this.root, this.index),
                    filename: 'index.html',
                    chunks: Object.keys(this.scripts.get()),
                    hash: true,
                    minify: {
                        removeAttributeQuotes: true
                    }
                })
            ]
        }
    }
}
