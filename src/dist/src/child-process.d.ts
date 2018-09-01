import { CoreBidgingSubject, CoreBidgingOption, CoreBidgingEvent } from './core-bidging';
export interface ForkChildProcessOption extends CoreBidgingOption {
    file: string;
}
export declare class ForkChildProcessSubject<T extends CoreBidgingEvent> extends CoreBidgingSubject<T, ForkChildProcessOption> {
    constructor(option: ForkChildProcessOption);
}
