const {
    join
} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mapRxjs = require('rxjs/_esm2015/path-mapping');
module.exports = {
    mode: "production",
    entry: {
        index: join(__dirname, './api.js')
    },
    resolve: {
        alias: {
            ...mapRxjs()
        }
    },
    output: {
        path: join(__dirname, "dist"),
        libraryTarget: "umd"
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    module: {
        rules: []
    },
    optimization: {
        runtimeChunk: "single",
        occurrenceOrder: true,
        noEmitOnErrors: true,
        namedChunks: true,
        namedModules: true
    }
}
