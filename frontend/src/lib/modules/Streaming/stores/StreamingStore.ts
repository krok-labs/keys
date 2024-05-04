import { AbstractSharedStore } from "$lib/helpers";
import { writable } from "svelte/store";
import { StreamingChannel } from "../BroadcastChannel";

interface StreamingStoreInterface {
    // todo: move to shared types
    role: "document_scanner" | "face_scanner";
};

type ListenerHandler = (frame: Buffer) => void;

class StreamingStoreClass {
    public subscribe;
    protected update;

    private listeners: Array<ListenerHandler> = [];
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

        // Listening to our StreamingChannel for new frames
        StreamingChannel.addEventListener('message', (event) => this.handleFrame(event.data));
    }

    public async dispose() {};

    // Start streaming
    async start(role: StreamingStoreInterface["role"]) {
        // todo: implement
    };

    handleFrame(frame: Buffer) {
        // Sharing this frame with our listeners
        for (const listener of this.listeners) {
            listener(frame);
        };

        if (this.side == "admin") {
            // Sharing this frame with guest side
            StreamingChannel.postMessage(frame);
        };
    };

    public onFrame(handler: ListenerHandler) {
        this.listeners.push(handler);
    };

    public removeAllListeners() {
        this.listeners = [];
    }
};

export const StreamingStore = new StreamingStoreClass();