
export interface SocketIOClientStatic {
    (uri: string, opts?: ConnectOpts): Socket;
    (opts?: ConnectOpts): Socket;
    connect(uri: string, opts?: ConnectOpts): Socket;
    connect(opts?: ConnectOpts): Socket;
    protocol: number;
    Socket: Socket;
    Manager: ManagerStatic;
    managers: { [key: string]: Manager }
}

export interface Emitter {
    on(event: string, fn: Function): Emitter;
    addEventListener(event: string, fn: Function): Emitter;
    once(event: string, fn: Function): Emitter;
    off(event: string, fn?: Function): Emitter;
    removeListener(event: string, fn?: Function): Emitter;
    removeEventListener(event: string, fn?: Function): Emitter;
    removeAllListeners(): Emitter;
    emit(event: string, ...args: any[]): Emitter;
    listeners(event: string): Function[];
    hasListeners(event: string): boolean;
}
export interface SocketStatic {
    (io: Manager, nsp: string): Socket;
    new(url: string, opts: any): Manager;
}
export interface Socket extends Emitter {
    io: Manager;
    nsp: string;
    id: string;
    connected: boolean;
    disconnected: boolean;
    open(): Socket;
    connect(): Socket;
    send(...args: any[]): Socket;
    emit(event: string, ...args: any[]): Socket;
    close(): Socket;
    disconnect(): Socket;
    compress(compress: boolean): Socket;
}
export interface ManagerStatic {
    (uri: string, opts?: ConnectOpts): Manager;
    (opts: ConnectOpts): Manager;
    new(uri: string, opts?: ConnectOpts): Manager;
    new(opts: ConnectOpts): Manager;
}
export interface Manager extends Emitter {
    nsps: { [namespace: string]: Socket };
    opts: ConnectOpts;
    readyState: string;
    uri: string;
    connecting: Socket[];
    autoConnect: boolean;
    reconnection(): boolean;
    reconnection(v: boolean): Manager;
    reconnectionAttempts(): number;
    reconnectionAttempts(v: number): Manager;
    reconnectionDelay(): number;
    reconnectionDelay(v: number): Manager;
    reconnectionDelayMax(): number;
    reconnectionDelayMax(v: number): Manager;
    randomizationFactor(): number;
    randomizationFactor(v: number): Manager;
    timeout(): number;
    timeout(v: number): Manager;
    open(fn?: (err?: any) => void): Manager;
    connect(fn?: (err?: any) => void): Manager;
    socket(nsp: string): Socket;
}
export interface ConnectOpts {
    forceNew?: boolean;
    multiplex?: boolean;
    path?: string;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    reconnectionDelayMax?: number;
    randomizationFactor?: number;
    timeout?: number;
    autoConnect?: boolean;
    host?: string;
    hostname?: string;
    secure?: boolean;
    port?: string;
    query?: Object;
    agent?: string | boolean;
    upgrade?: boolean;
    forceJSONP?: boolean;
    jsonp?: boolean;
    forceBase64?: boolean;
    enablesXDR?: boolean;
    timestampParam?: string;
    timestampRequests?: boolean;
    transports?: string[];
    policyPost?: number;
    rememberUpgrade?: boolean;
    onlyBinaryUpgrades?: boolean;
    transportOptions?: Object;
    pfx?: string;
    key?: string;
    passphrase?: string
    cert?: string;
    ca?: string | string[];
    ciphers?: string;
    rejectUnauthorized?: boolean;
}
