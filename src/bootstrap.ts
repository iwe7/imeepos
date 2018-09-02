import { merge } from 'rxjs';

import { CPForkSubject } from './core';
const forks = [];
for (let i = 0; i < 10; i++) {
    forks.push(run('./forks/test', (i + 1) * 100000000));
}

merge(...forks).pipe().subscribe(res => {
    console.log(res);
});

function run(file: string, start: number) {
    const fork = new CPForkSubject(file, start).pipe();
    return fork;
}
