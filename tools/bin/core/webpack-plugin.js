"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
const webpack = require("webpack");
const CircularDependencyPlugin = require('circular-dependency-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
class WebpackPlugin extends webpack_1.Plugin {
    constructor() {
        super();
        this.pageId = 0;
        this.plugins = new Map();
    }
    get() {
        const plugins = [];
        this.plugins.forEach(p => plugins.push(p));
        return plugins;
    }
    setPlugin(name, plugin) {
        this.plugins.set(name, plugin);
    }
    setProgressPlugin(options) {
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
    setHtmlWebpackPlugin(pages) {
        pages.map(page => {
            this.pageId++;
            const htmlWebpackPluginInstance = new HtmlWebpackPlugin(page);
            this.setPlugin(`html-webpack-plugin-${this.pageId}`, htmlWebpackPluginInstance);
        });
    }
    /**
     * npm i webpack-bundle-analyzer
     */
    setWebpackBundleAnalyzer() {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        const bundleAnalyzerPluginInstance = new BundleAnalyzerPlugin();
        this.setPlugin('webpack-bundle-analyzer', bundleAnalyzerPluginInstance);
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
    setDllPlugin(root) {
        const dllPlugin = new webpack.DllPlugin({
            name: '_dll_[name]',
            path: path.join(root, 'manifest.json'),
            context: '.'
        });
        this.setPlugin('dll-plugin', dllPlugin);
    }
}
exports.WebpackPlugin = WebpackPlugin;
//# sourceMappingURL=webpack-plugin.js.map