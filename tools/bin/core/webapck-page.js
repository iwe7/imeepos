"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
class WebpackPage {
    constructor(root) {
        this.root = root;
    }
    get() {
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
        };
    }
}
exports.WebpackPage = WebpackPage;
//# sourceMappingURL=webapck-page.js.map