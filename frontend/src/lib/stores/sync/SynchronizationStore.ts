import { EventHandler, EventType, SynchronizationState } from "$lib/types";
import { writable } from "svelte/store";
import { HeartbeatEvent, RoleSelectedEvent, StoreUpdateEvent } from "./events";

const EVENTS_MAP: Map<EventType, EventHandler<any>> = new Map();

// Class interface
export interface SynchronizationStoreInterface {
    state: SynchronizationState,
};

// Class itself
class SynchronizationStoreClass {
    public subscribe;
    private update;

    public readonly clientId: string;
    public readonly channel;

    constructor() {
        const { subscribe, update } = writable<SynchronizationStoreInterface>({
            state: SynchronizationState.WAITING
        });

        this.subscribe = subscribe;
        this.update = update;

        this.channel = new BroadcastChannel("sync");
        // urgh?
        this.clientId = String(Math.floor(Math.random() * 10));
    }

    public setState(state: SynchronizationState) {
        this.update((store) => {
            return {
                ...store,
                state,
            };
        });
    };

    public initialize() {
        EVENTS_MAP.set(EventType.HEARTBEAT, HeartbeatEvent);
        EVENTS_MAP.set(EventType.ROLE_SELECTED, RoleSelectedEvent);
        EVENTS_MAP.set(EventType.STORE_UPDATE, StoreUpdateEvent);        

        // Subscribing to events on this channel
        this.channel.addEventListener('message', (event) => {
            const { data } = event;

            if (data.type == null) throw new Error("Invalid synchronizer eventType");
            if (!Object.values(EventType).includes(data.type as any)) throw new Error(`Invalid eventType: ${data} from event: ${data}`);

            // Finding event handler and invoking it's .handle method
            const handler = EVENTS_MAP.get(data.type as EventType)!;
            handler.handle(data as any, event as any);
        });

        // Heartbeat Event
        setInterval(() => {
            HeartbeatEvent.invoke(this.channel, { client: this.clientId });
        }, 500);
    };
};

export const SynchronizationStore = new SynchronizationStoreClass();