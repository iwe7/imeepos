/// <reference types="node" />
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Observer, Subject, Subscriber, Subscription } from 'rxjs';
import { EventEmitter } from 'events';
export declare class CoreBidgingEvent<T = any> {
    action: string;
    payload: T;
    constructor(action: string, payload: T);
}
export interface CoreBidgingOption<T = any> {
    serializer?: (value: T) => CoreBidgingEvent;
    deserializer?: (e: CoreBidgingEvent) => T;
    bidging?: new (option: any) => CoreBidging;
}
export declare abstract class CoreBidging<O = any, T extends CoreBidgingOption = any> extends EventEmitter {
    closed: boolean;
    option: T;
    constructor(option: T);
    abstract close(msg?: O): void;
    abstract create(next: (value: O) => void, error: (err: Error) => void, complete: () => void): void;
    abstract send(msg: O, handel?: any): void;
}
export declare abstract class CoreBidgingSubject<T = any, O extends CoreBidgingOption = any> extends AnonymousSubject<T> {
    config: O;
    _bidging: CoreBidging;
    _output: Subject<T>;
    constructor(config: O, destination?: Observer<T>);
    createBidging(): CoreBidging;
    _subscribe(subscriber: Subscriber<T>): Subscription;
    unsubscribe(): void;
    _resetState(): void;
}
