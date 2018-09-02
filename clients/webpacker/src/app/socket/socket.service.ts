import { Injectable } from '@angular/core';
import { SocketSubject, ConnectOption } from './ims-socket.io-client/src';
@Injectable({
    providedIn: "root"
})
export class SocketService {
    socket: SocketSubject<any>;
    constructor() { }
    connect(url: string = 'http://localhost:8081', options?: ConnectOption): SocketSubject<any> {
        this.socket = new SocketSubject(url, options);
        console.log(this.socket);
        this.socket.subscribe();
        return this.socket;
    }

    send(data: any) {
        this.socket.next(data);
    }
}
