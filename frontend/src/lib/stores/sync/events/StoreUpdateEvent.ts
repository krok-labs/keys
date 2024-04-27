import { EventType, type EventHandler } from "$lib/types";

export interface StoreUpdateEventPayload {
    type: EventType.STORE_UPDATE,
    storeId: string,
    data: any,
};

type UpdateHandler = (data: any) => void;

class StoreUpdateEventClass implements EventHandler<StoreUpdateEventPayload> {
    private readonly handlers: Map<string, UpdateHandler> = new Map();

    public onUpdate(storeId: string, handler: UpdateHandler) {
        this.handlers.set(storeId, handler);
    };
    
    async handle({ storeId, data }: StoreUpdateEventPayload, event: MessageEvent<StoreUpdateEventPayload>) {
        // Finding updateHandler for this store and invoking it
        const updateHandler = this.handlers.get(storeId);
        if (updateHandler != null) updateHandler(data);
    }

    async invoke(channel: BroadcastChannel, opts: { storeId: string, data: any }) {
        channel.postMessage({
            type: EventType.STORE_UPDATE,
            ...opts
        } as StoreUpdateEventPayload);
    };
};

export const StoreUpdateEvent = new StoreUpdateEventClass();
