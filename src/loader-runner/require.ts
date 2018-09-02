
export interface CoreRequireFunction<T = any> {
    (id: string): T;
}

export interface RequireResolve {
    (id: string, options?: { paths?: string[]; }): string;
    paths(request: string): string[] | null;
}

export interface CoreRequireExtensions {
    '.js': (m: CoreRequireModule, filename: string) => any;
    '.json': (m: CoreRequireModule, filename: string) => any;
    '.node': (m: CoreRequireModule, filename: string) => any;
    [ext: string]: (m: CoreRequireModule, filename: string) => any;
}

export interface CoreRequireModule<T = any> {
    exports: any;
    require: CoreRequireFunction<T>;
    id: string;
    filename: string;
    loaded: boolean;
    parent: CoreRequireModule | null;
    children: CoreRequireModule[];
    paths: string[];
}

export interface CoreRequire<T = any> extends CoreRequireFunction<T> {
    resolve: RequireResolve;
    cache: any;
    extensions: CoreRequireExtensions;
    main: CoreRequireModule | undefined;
}
