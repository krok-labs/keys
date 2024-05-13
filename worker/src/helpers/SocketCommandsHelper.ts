import { CameraRole } from "src/modules/CameraStream/types";
import { EventEmitter } from "stream";

export const SocketCommandsHelper = {
    sendProcessingCard(bus: EventEmitter) {
        bus.emit('message', {
            // todo: create shared enum
            type: "processingCard"
        });
    },

    sendCardId(bus: EventEmitter, cardId: number) {
        bus.emit('message', {
            // todo: create shared enum
            type: "cardId",
            cardId,
        });
    },

    selectCamera(bus: EventEmitter, role: CameraRole) {
        console.log('cam', role);
    },

    sendStreamFrame(bus: EventEmitter, frame: any) {
        bus.emit('stream', "data:image/jpeg;base64," + Buffer.from(frame).toString('base64'));
    }
};
