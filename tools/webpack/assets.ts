const CopyWebpackPlugin = require('copy-webpack-plugin');
import * as path from 'path';
export interface AssetPatternObject {
    glob: string;
    input: string;
    output: string;
}

export function getAssets(assets: AssetPatternObject[], root: string) {
    const copyWebpackPluginPatterns = assets.map((asset: AssetPatternObject) => {
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
    const copyWebpackPluginInstance = new CopyWebpackPlugin(
        copyWebpackPluginPatterns,
        copyWebpackPluginOptions
    );
    (copyWebpackPluginInstance as any)['copyWebpackPluginPatterns'] = copyWebpackPluginPatterns;
    (copyWebpackPluginInstance as any)['copyWebpackPluginOptions'] = copyWebpackPluginOptions;
    return copyWebpackPluginInstance;
}
