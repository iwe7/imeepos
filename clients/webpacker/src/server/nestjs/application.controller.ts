import { Injectable, Get } from "@nestjs/common";

@Injectable()
export class ApplicationController {
    @Get()
    index() {
        return 'index';
    }
}
