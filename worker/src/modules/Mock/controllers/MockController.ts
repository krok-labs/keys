import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { SocketCommandsService } from "src/modules/SocketConnection/services";

@Controller('/mock')
export class MockController {
    constructor(
        private readonly commandsService: SocketCommandsService,
    ) {}
    
    @Get('/:id')
    public emulateKeycard(
        @Param('id', ParseIntPipe) id: number
    ) {
        this.commandsService.sendCardId(id);
        return true;
    };
};
