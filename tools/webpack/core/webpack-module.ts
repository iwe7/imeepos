import { Module, RuleSetRule } from 'webpack';
const ExtractTextWebapckPlugin = require('extract-text-webpack-plugin')

import { Injectable } from '@angular/core';
@Injectable({
    providedIn: "root"
})
export class WebpackModule {
    rules: RuleSetRule[] = [
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
                    outputPath: 'dist/public/images/', // 图片输出的路径
                    limit: 1 * 1024
                }
            }
        }
    ];

    rulesMap: Map<string, RuleSetRule> = new Map();

    constructor(
        private root: string
    ) { }

    get(): Module {
        const rules: RuleSetRule[] = [];
        this.rulesMap.forEach(rule => rules.push(rule));
        return {
            rules: rules
        }
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
        })
    }
}
