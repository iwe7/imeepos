import { Path } from '@angular-devkit/core';
import { Plugin } from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
export declare class WebpackPlugin extends Plugin {
    pageId: number;
    plugins: Map<string, Plugin>;
    constructor();
    get(): Plugin[];
    setPlugin(name: string, plugin: Plugin): void;
    setProgressPlugin(options: (percentage: number, msg: string, moduleProgress?: string, activeModules?: string, moduleName?: string) => void): void;
    setCircularDependencyPlugin(): void;
    /**
     * npm i assets-webpack-plugin
     */
    setAssetsWebpackPlugin(): void;
    /**
     * npm i html-webpack-plugin
     */
    setHtmlWebpackPlugin(pages: HtmlWebpackPlugin.Options[]): void;
    /**
     * npm i webpack-bundle-analyzer
     */
    setWebpackBundleAnalyzer(): void;
    /**
     * npm i webpack-parallel-uglify-plugin
     */
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
    setDllPlugin(root: Path): void;
}
