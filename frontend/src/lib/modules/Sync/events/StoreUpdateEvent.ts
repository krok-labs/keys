import { EventType, type EventHandler } from "$lib/types";

export interface StoreUpdateEventPayload {
    type: EventType.STORE_UPDATE,
    storeId: string,
    senderUrl: string,
    data: any,
};

type UpdateHandler = (data: StoreUpdateEventPayload, event: MessageEvent<StoreUpdateEventPayload>) => void;

class StoreUpdateEventClass implements EventHandler<StoreUpdateEventPayload> {
    private readonly handlers: Map<string, UpdateHandler> = new Map();

    public onUpdate(storeId: string, handler: UpdateHandler) {
        this.handlers.set(storeId, handler);
    };
    
    async handle(data: StoreUpdateEventPayload, event: MessageEvent<StoreUpdateEventPayload>) {
        // Finding updateHandler for this store and invoking it
        const updateHandler = this.handlers.get(data.storeId);
        if (updateHandler != null) updateHandler(data, event);
    }

    async invoke(channel: BroadcastChannel, opts: Omit<StoreUpdateEventPayload, "type">) {
        channel.postMessage({
            ...opts,
            type: EventType.STORE_UPDATE,
        } as StoreUpdateEventPayload);
    };
};

export const StoreUpdateEvent = new StoreUpdateEventClass();
