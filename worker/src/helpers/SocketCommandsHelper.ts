import { CameraRole } from "src/modules/CameraStream/types";
import { EventEmitter } from "stream";

export const SocketCommandsHelper = {
    sendProcessingCard(bus: EventEmitter) {
        bus.emit('card_reader', {
            // todo: create shared enum
            type: "processingCard"
        });
    },

    sendCardId(bus: EventEmitter, cardId: number) {
        bus.emit('card_reader', {
            // todo: create shared enum
            type: "cardId",
            cardId,
        });
    },

    selectCamera(bus: EventEmitter, role: CameraRole) {
        bus.emit('selectCamera', role);
    },

    stopStreaming(bus: EventEmitter) {
        bus.emit('stopStreaming');
    },

    sendStreamFrame(bus: EventEmitter, frame: any) {
        bus.emit('stream', "data:image/jpeg;base64," + Buffer.from(frame).toString('base64'));
    }
};
