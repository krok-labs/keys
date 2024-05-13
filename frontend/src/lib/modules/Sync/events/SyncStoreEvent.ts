import { EventType, type EventHandler } from "$lib/types";
import { SynchronizationStore } from "../SynchronizationStore";

export interface SyncStoreEventPayload {
    type: EventType.SYNC_STORE,
    storeId: string,
    data: any
};

type UpdateHandler = (data: SyncStoreEventPayload) => void;

class SyncStoreEventClass implements EventHandler<SyncStoreEventPayload> {
    private readonly handlers: Map<string, Array<UpdateHandler>> = new Map();

    public onUpdate(storeId: string, handler: UpdateHandler) {
        if (this.handlers.get(storeId) == null) this.handlers.set(storeId, []);
        this.handlers.set(storeId, [...this.handlers.get(storeId) ?? [], handler]);
    };
    
    async handle(data: SyncStoreEventPayload) {
        // Finding updateHandler for this store and invoking it
        const updateHandlers = this.handlers.get(data.storeId);
        if (updateHandlers != null) for (const handler of updateHandlers) handler(data);
    }

    async invoke(opts: Omit<SyncStoreEventPayload, "type">) {
        SynchronizationStore.sendEvent({
            type: EventType.SYNC_STORE,
            ...opts
        });
    };
};

export const SyncStoreEvent = new SyncStoreEventClass();
