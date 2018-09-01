import { CoreBidging, CoreBidgingSubject, CoreBidgingOption, CoreBidgingEvent } from './core-bidging';
export declare class CoreProcess extends CoreBidging {
    close(msg?: any): void;
    create(next: (value: any) => void, error: (err: Error) => void, complete: () => void): void;
    send(msg: any, handel?: any): void;
}
export declare class ProcessSubject<T extends CoreBidgingEvent> extends CoreBidgingSubject<T> {
    constructor(option: CoreBidgingOption);
}
