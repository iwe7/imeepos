import { Injectable, Template } from 'iwe8/compiler';

@Injectable()
@Template({
    input: 'imeepos.json',
    output: 'imeepos.json'
})
export default class JsonComponent {
    name: string;
    constructor() {
        this.name = 'iwe7-demo'
    }
}
