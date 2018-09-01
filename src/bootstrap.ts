

import { ForkChildProcessSubject } from 'imeepos-child-process';
const fork = new ForkChildProcessSubject({
    file: "./forks/test"
});
fork.pipe().subscribe(
    res => {
        console.log('recive', res.action);
        if (res.action === 'finish') {
            fork.unsubscribe();
        }
    },
    err => console.log(err),
    () => console.log('complete')
);
