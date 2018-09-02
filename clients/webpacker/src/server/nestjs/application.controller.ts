import { Get, Controller } from "@nestjs/common";

@Controller()
export class ApplicationController {
    @Get()
    index() {
        return 'index';
    }
}
