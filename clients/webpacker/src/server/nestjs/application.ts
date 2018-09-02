import { ApplicationController } from './application.controller';
import { Module } from "@nestjs/common";
import { SocketEvent } from "./sockets/socket";

@Module({
    providers: [
        // SocketEvent
    ],
    controllers: [
        ApplicationController
    ]
})
export class Application {

}
