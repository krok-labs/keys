import { WorkerConnectionStore } from "$lib/modules/Worker";
import { writable } from "svelte/store";

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

    constructor() {
        const { subscribe, update } = writable<StreamingStoreInterface>({
            role: "document_scanner"
        });

        this.subscribe= subscribe;
        this.update = update;
    };

    public async initialize() {
        // Subscribing to stream
        WorkerConnectionStore.subscribe("camera_stream");
    }

    public async dispose() {
        // Unsubscribing from stream messages
        WorkerConnectionStore.unsubscribe("camera_stream");
    };

    // Start streaming
    async start(role: StreamingStoreInterface["role"]) {
        WorkerConnectionStore.send(role, "selectCamera");
        WorkerConnectionStore.subscribe("camera_stream");
    };

    async stop() {
        WorkerConnectionStore.send(undefined, "stopStreaming");
        WorkerConnectionStore.unsubscribe("camera_stream");
    };

    handleFrame(frame: string) {
        // Sharing this frame with our listeners
        for (const [ id, handler ] of this.listeners) {
            handler(frame);
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