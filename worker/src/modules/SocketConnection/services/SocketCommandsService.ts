import { Injectable } from "@nestjs/common";
import { EventBusService } from "src/modules/EventBus/services";

@Injectable()
export class SocketCommandsService {
    constructor(
        private readonly eventBus: EventBusService,
    ) {}
    
    // Send processing card event
    public sendProcessingCardEvent() {
        this.eventBus.instance.emit('message', {
            // todo: create shared enum
            type: "processingCard"
        });
    };

    // Send card id
    public sendCardId(id: number) {
        this.eventBus.instance.emit('message', {
            // todo: create shared enum
            type: "cardId",
            cardId: id,
        });
    };

    // Video
    public sendVideoFrame(frame: string) {
        this.eventBus.instance.emit('stream', frame);
    };
};
