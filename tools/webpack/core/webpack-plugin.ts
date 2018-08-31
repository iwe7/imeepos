import { Path } from '@angular-devkit/core';
import { Plugin } from 'webpack';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackPlugin {
    pageId: number = 0;
    plugins: Map<string, Plugin> = new Map();

    constructor() {}

    get(): Plugin[] {
        const plugins: Plugin[] = [];
        this.plugins.forEach(p => plugins.push(p))
        return plugins;
    }

    setPlugin(name: string, plugin: Plugin) {
        this.plugins.set(name, plugin);
    }

    setProgressPlugin(options: (
        percentage: number,
        msg: string,
        moduleProgress?: string,
        activeModules?: string,
        moduleName?: string
    ) => void) {
        this.setPlugin('progress', new webpack.ProgressPlugin(options));
    }

    setCircularDependencyPlugin() {

    }

    /**
     * npm i assets-webpack-plugin
     */
    setAssetsWebpackPlugin() {
        const AssetsPlugin = require('assets-webpack-plugin');
        const assetsPluginInstance = new AssetsPlugin();
        this.setPlugin('assets-webpack-plugin', assetsPluginInstance);
    }

    /**
     * npm i html-webpack-plugin
     */
    setHtmlWebpackPlugin(pages: HtmlWebpackPlugin.Options[]) {
        pages.map(page => {
            this.pageId++;
            const htmlWebpackPluginInstance = new HtmlWebpackPlugin(page);
            this.setPlugin(`html-webpack-plugin-${this.pageId}`, htmlWebpackPluginInstance)
        })
    }

    /**
     * npm i webpack-bundle-analyzer
     */
    setWebpackBundleAnalyzer() {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        const bundleAnalyzerPluginInstance = new BundleAnalyzerPlugin();
        this.setPlugin('webpack-bundle-analyzer', bundleAnalyzerPluginInstance)
    }

    /**
     * npm i webpack-parallel-uglify-plugin
     */


    // DllPlugin
    /**
     *  context: path.resolve(root),
     *  entry: {
     *    vendor: Object.keys(pkg.dependencies)
     *  },
     *  output{
     *     path: resolve('dist'),
     *    filename: '[name].dll.js',
     *    library: '_dll_[name]' // 全局变量名，其他模块会从此变量上获取里面模块
     * }
    */
    setDllPlugin(root: Path) {
        const dllPlugin = new webpack.DllPlugin({
            name: '_dll_[name]',
            path: path.join(root, 'manifest.json'),
            context: '.'
        });
        this.setPlugin('dll-plugin', dllPlugin);
    }
}
