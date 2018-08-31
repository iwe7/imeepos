export * from './webpack-base';
export * from './webpack-mult';
export * from './webpack-mult-dev-server';
export * from './webpack-mult-nest';
export const mainfast = 'dist/template/';
export const addons = 'dist/addons/';
export const temp = 'dist/data/.tmp';

export function getMainContext(name: string): string {
    return `${mainfast}${name}`
}
