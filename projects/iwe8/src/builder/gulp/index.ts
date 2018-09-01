import * as gulp from 'gulp';
import { src} from './src';
export class GulpBaseBuilder<T> { }
export class GulpBuilder extends GulpBaseBuilder<any> {
    run() {
        src('**/*.ts');
    }
}
