import { StreamingStore } from "$lib/modules/Streaming";
import { EventType, type EventHandler } from "$lib/types";
import { SynchronizationStore } from "../SynchronizationStore";

export type StreamingFramePayload = {
    frame: string,
};

class StreamingFrameEventClass implements EventHandler<StreamingFramePayload> {
    async handle(data: StreamingFramePayload) {
        StreamingStore.handleFrame(data.frame);
    }

    async invoke(opts: StreamingFramePayload) {
        SynchronizationStore.sendEvent({
            type: EventType.STREAMING_FRAME,
            ...opts
        });
    };
};

export const StreamingFrameEvent = new StreamingFrameEventClass();