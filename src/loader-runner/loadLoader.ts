import { System } from './systemjs';
import { CoreRequire } from './require';
declare const System: System;
declare const require: CoreRequire;
export interface Loader {
    path: string;
    normal: any;
    pitch: any;
    raw: any;
}
export type LoaderCallback = (err?: Error) => void;

export function loadLoader(loader: Loader, callback: LoaderCallback) {
    if (typeof System === "object" && typeof System.import === "function") {
        System.import(loader.path).catch(callback).then((_module) => {
            loader.normal = typeof _module === "function" ? _module : _module.default;
            loader.pitch = _module.pitch;
            loader.raw = _module.raw;
            if (typeof loader.normal !== "function" && typeof loader.pitch !== "function")
                throw new Error("Module '" + loader.path + "' is not a loader (must have normal or pitch function)");
            callback();
        })
    } else {
        let _module: any;
        try {
            _module = require(loader.path);
        } catch (e) {
            let retry = loadLoader.bind(null, loader, callback);
            return process.nextTick(retry);
        }
        loader.normal = typeof _module === "function" ? _module : _module.default;
        loader.pitch = _module.pitch;
        loader.raw = _module.raw;
        if (typeof loader.normal !== "function" && typeof loader.pitch !== "function")
            throw new Error("Module '" + loader.path + "' is not a loader (must have normal or pitch function)");
        callback();
    }
}
