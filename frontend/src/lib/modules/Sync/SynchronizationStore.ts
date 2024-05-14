import { EventHandler, EventType } from "$lib/types";
import { writable } from "svelte/store";
import { ChangeApplicationEvent, RoleSelectedEvent, SyncStoreEvent } from "./events";
import { SynchronizationState } from "./types";
import { Socket, io } from "socket.io-client";
import { getStore } from "$lib/helpers";
import { ApplicationConfigurationStore } from "../Application";

const EVENTS_MAP: Map<EventType, EventHandler<any>> = new Map();

// Class interface
export interface SynchronizationStoreInterface {
    state: SynchronizationState,
};

// Class itself
class SynchronizationStoreClass {
    public subscribe;
    private update;

    public channel?: Socket;

    constructor() {
        const { subscribe, update } = writable<SynchronizationStoreInterface>({
            state: SynchronizationState.DISCONNECTED
        });

        this.subscribe = subscribe;
        this.update = update;
    }

    public setState(state: SynchronizationState) {
        console.log("update state:", state);
        this.update((store) => {
            return {
                ...store,
                state,
            };
        });
    };

    public async initialize() {
        const configuration = await getStore(ApplicationConfigurationStore.subscribe);
        console.debug('[SynchronizationStore.initialize] Initializing synchronization store');

        // Initializing our socket connection
        this.channel = io(`${configuration.synchronizationUrl}`, {
            query: {
                sessionKey: configuration.sessionKey,
                side: configuration.side,
            },
        });
        this.channel.connect();

        // Listeners
        this.channel.on('connect_error', (err) => console.error(err));
        this.channel.on('connect', () => this.setState(SynchronizationState.CONNECTED));
        this.channel.on('disconnect', () => this.setState(SynchronizationState.DISCONNECTED));

        // Events map
        EVENTS_MAP.set(EventType.ROLE_SELECTED, RoleSelectedEvent);
        EVENTS_MAP.set(EventType.SYNC_STORE, SyncStoreEvent);
        EVENTS_MAP.set(EventType.CHANGE_APPLICATION, ChangeApplicationEvent);

        // Subscribing to events on this channel
        this.channel.on('event', (data) => {
            if (data.type == null) throw new Error("Invalid synchronizer eventType");
            if (!Object.values(EventType).includes(data.type as any)) throw new Error(`Invalid eventType: ${data} from event: ${data}`);

            // Finding event handler and invoking it's .handle method
            const handler = EVENTS_MAP.get(data.type as EventType)!;
            handler.handle(data as any, event as any);
        });
    };

    public async sendEvent(payload: any) {
        this.channel?.emit('event', payload);
    };
    
    public dispose() {
        // todo: logic
        this.channel?.disconnect();
    };
};

export const SynchronizationStore = new SynchronizationStoreClass();