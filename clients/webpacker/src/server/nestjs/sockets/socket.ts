import { WebSocketGateway, WebSocketServer, SubscribeMessage, WsResponse } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway()
export class SocketEvent {
    @WebSocketServer() server;
    constructor() {}
    @SubscribeMessage('message')
    onEvent(client, data): Observable<WsResponse<number>> {
        console.log(data);
        const event = 'message';
        const response = [1, 2, 3];
        return from(response).pipe(map(res => ({ event, data: res })));
    }
}
