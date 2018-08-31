"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");
function getAssets(assets, root) {
    const copyWebpackPluginPatterns = assets.map((asset) => {
        asset.input = path.resolve(root, asset.input).replace(/\\/g, '/');
        asset.input = asset.input.endsWith('/') ? asset.input : asset.input + '/';
        asset.output = asset.output.endsWith('/') ? asset.output : asset.output + '/';
        if (asset.output.startsWith('..')) {
            const message = 'An asset cannot be written to a location outside of the output path.';
            throw new Error(message);
        }
        return {
            context: asset.input,
            to: asset.output.replace(/^\//, ''),
            from: {
                glob: asset.glob,
                dot: true
            }
        };
    });
    const copyWebpackPluginOptions = { ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'] };
    const copyWebpackPluginInstance = new CopyWebpackPlugin(copyWebpackPluginPatterns, copyWebpackPluginOptions);
    copyWebpackPluginInstance['copyWebpackPluginPatterns'] = copyWebpackPluginPatterns;
    copyWebpackPluginInstance['copyWebpackPluginOptions'] = copyWebpackPluginOptions;
    return copyWebpackPluginInstance;
}
exports.getAssets = getAssets;
//# sourceMappingURL=assets.js.map