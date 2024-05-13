import { AbstractSharedStore } from "$lib/helpers";
import { writable } from "svelte/store";
import { StreamingChannel } from "../BroadcastChannel";
import { StreamingFrameEvent } from "$lib/modules/Sync";

interface StreamingStoreInterface {
    // todo: move to shared types
    role: "document_scanner" | "face_scanner";
};

type ListenerHandler = (frame: string) => void;

class StreamingStoreClass {
    public subscribe;
    protected update;

    private latestListenerId = -1;
    private listeners: Map<number, ListenerHandler> = new Map();
    private side: "admin" | "guest" = "admin";

    constructor() {
        const { subscribe, update } = writable<StreamingStoreInterface>({
            role: "document_scanner"
        });

        this.subscribe= subscribe;
        this.update = update;
    };

    // Onoly for guest side
    public async initialize() {
        console.debug('[StreamingStore.initialize] Subscribing to StreamingChannel updates as guest');

        this.side = "guest";
    }

    public async dispose() {};

    // Start streaming
    async start(role: StreamingStoreInterface["role"]) {
        // todo: implement
    };

    handleFrame(frame: string) {
        // Sharing this frame with our listeners
        for (const [ id, handler ] of this.listeners) {
            handler(frame);
        };

        if (this.side == "admin") {
            // Sharing this frame with guest side
            StreamingFrameEvent.invoke({ frame });
        };
    };

    public onFrame(handler: ListenerHandler): number {
        this.latestListenerId++;
        this.listeners.set(this.latestListenerId, handler);
        
        return this.latestListenerId;
    };

    public removeListener(id: number) {
        this.listeners.delete(id);
    }

    public removeAllListeners() {
        this.listeners.clear();
    }
};

export const StreamingStore = new StreamingStoreClass();