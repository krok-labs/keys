import { Injectable } from "@nestjs/common";
import { SocketEventsService } from "./private";

@Injectable()
export class SocketCommandsService {
    constructor(
        private readonly eventsService: SocketEventsService,
    ) {}
    
    // Send processing card event
    public sendProcessingCardEvent() {
        this.eventsService.events.emit('message', {
            // todo: create shared enum
            type: "processingCard"
        });
    };

    // Send card id
    public sendCardId(id: number) {
        this.eventsService.events.emit('message', {
            // todo: create shared enum
            type: "cardId",
            cardId: id,
        });
    };
};
