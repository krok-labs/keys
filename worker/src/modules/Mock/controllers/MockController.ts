import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { EventBusService } from "src/modules/EventBus/services";

@Controller('/mock')
export class MockController {
    constructor(
        private readonly eventBus: EventBusService,
    ) {}
    
    @Get('/:id')
    public emulateKeycard(
        @Param('id', ParseIntPipe) id: number
    ) {
        this.eventBus.instance.emit('message', {
            // todo: create shared enum
            type: "cardId",
            cardId: id,
        });
        
        return true;
    };
};
