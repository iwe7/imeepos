"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtractTextWebapckPlugin = require('extract-text-webpack-plugin');
class WebpackModule {
    constructor(root) {
        this.root = root;
        this.rules = [
            {
                test: /\.css$/,
                use: ExtractTextWebapckPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                }),
                include: this.root,
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: ExtractTextWebapckPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                }),
                include: this.root,
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ExtractTextWebapckPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                }),
                include: this.root,
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['env', 'stage-0']
                    }
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'dist/public/images/',
                        limit: 1 * 1024
                    }
                }
            }
        ];
        this.rulesMap = new Map();
    }
    get() {
        const rules = [];
        this.rulesMap.forEach(rule => rules.push(rule));
        return {
            rules: rules
        };
    }
    addTsRule() {
        this.rulesMap.set('ts', {
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true
                    },
                },
                { loader: 'ts-loader' }
            ]
        });
    }
}
exports.WebpackModule = WebpackModule;
//# sourceMappingURL=webpack-module.js.map