export interface ModulesList {
    [bundleName: string]: string[];
}
export interface PackageList<T> {
    [packageName: string]: T;
}
export type ModuleFormat = "esm" | "cjs" | "amd" | "global" | "register";
export type Transpiler = "plugin-traceur" | "plugin-babel" | "plugin-typescript" | "traceur" | "babel" | "typescript" | false;
export type ConfigMap = PackageList<string | PackageList<string>>;
export type ConfigMeta = PackageList<MetaConfig>;
export interface MetaConfig {
    format?: ModuleFormat;
    exports?: string;
    deps?: string[];
    globals?: string;
    loader?: string;
    sourceMap?: any;
    scriptLoad?: boolean;
    nonce?: string;
    integrity?: string;
    crossOrigin?: string;
    esmExports?: boolean;
    build?: boolean;
    authorization?: string | boolean;
}
export interface PackageConfig {
    main?: string;
    format?: ModuleFormat;
    defaultExtension?: boolean | string;
    map?: ConfigMap;
    meta?: ConfigMeta;
}
export interface TraceurOptions {
    properTailCalls?: boolean;
    symbols?: boolean;
    arrayComprehension?: boolean;
    asyncFunctions?: boolean;
    asyncGenerators?: any;
    forOn?: boolean;
    generatorComprehension?: boolean;
}
export interface Config {
    [customName: string]: any;
    baseURL?: string;
    babelOptions?: any;
    bundles?: ModulesList;
    defaultJSExtensions?: boolean;
    depCache?: ModulesList;
    map?: ConfigMap;
    meta?: ConfigMeta;
    packages?: PackageList<PackageConfig>;
    paths?: PackageList<string>;
    traceurOptions?: TraceurOptions;
    transpiler?: Transpiler;
    trace?: boolean;
    typescriptOptions?: {
        tsconfig?: boolean | string,
        [key: string]: any
    };
}
export interface System extends Config {
    amdDefine(...args: any[]): void;
    amdRequire(deps: string[], callback: (...modules: any[]) => void): void;
    config(config: Config): void;
    constructor: new () => System;
    delete(moduleName: string): void;
    get(moduleName: string): any;
    getConfig(): Config;
    has(moduleName: string): boolean;
    import(moduleName: string, normalizedParentName?: string): Promise<any>;
    isModule(object: any): boolean;
    newModule(object: any): any;
    register(name: string, deps: string[], declare: (...modules: any[]) => any): void;
    register(deps: string[], declare: (...modules: any[]) => any): void;
    registerDynamic(name: string, deps: string[], executingRequire: boolean, declare: (...modules: any[]) => any): void;
    registerDynamic(deps: string[], executingRequire: boolean, declare: (...modules: any[]) => any): void;
    set(moduleName: string, module: any): void;
    resolve(moduleName: string, parentName?: string): Promise<string>;
    resolveSync(moduleName: string, parentName?: string): string;
    _nodeRequire(dep: string): any;
    loads: PackageList<any>;
    env: string;
    loaderErrorStack: boolean;
    packageConfigPaths: string[];
    pluginFirst: boolean;
    version: string;
    warnings: boolean;
}
