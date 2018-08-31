export interface AssetPatternObject {
    glob: string;
    input: string;
    output: string;
}
export declare function getAssets(assets: AssetPatternObject[], root: string): any;
