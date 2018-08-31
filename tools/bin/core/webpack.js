"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_module_1 = require("./webpack-module");
let webpackId = 0;
class Webpack {
    constructor(root) {
        this.root = root;
        webpackId += 1;
        this.name = `webpack-${webpackId}`;
        this.module = new webpack_module_1.WebpackModule(this.root);
    }
    get() {
        return {
            mode: this.mode,
            name: this.name,
            context: this.context,
            entry: this.entry.get(),
            output: this.output,
            devtool: this.devtool,
            plugins: this.plugin.get(),
            stats: this.stats.get(),
            performance: this.performance.get(),
            optimization: this.optimization.get(),
            module: this.module.get(),
            resolve: this.resolve.get(),
            resolveLoader: this.resolveLoader.get(),
            externals: this.externals.get(),
            target: this.target,
            bail: this.bail,
            profile: this.profile,
            cache: this.cache,
            watch: this.watch,
            watchOptions: this.watchOptions,
            debug: this.debug,
            node: this.node,
            amd: this.amd,
            recordsPath: this.recordsPath,
            recordsInputPath: this.recordsInputPath,
            recordsOutputPath: this.recordsOutputPath,
            parallelism: this.parallelism
        };
    }
    setMode(mode) {
        this.mode = mode;
    }
}
exports.Webpack = Webpack;
//# sourceMappingURL=webpack.js.map