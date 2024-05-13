import { Socket, io } from "socket.io-client";
import { CardIdEvent, ProcessingCardEvent } from "./events";
import { StreamingStore } from "../Streaming";
import { getStore } from "$lib/helpers";
import { ApplicationConfigurationStore } from "../Application";

class WorkerConnectionStoreClass {
    private client?: Socket;
    
    constructor() {};

    public async initialize() {
        const configuration = await getStore(ApplicationConfigurationStore.subscribe);
        this.client = io(configuration.workerUrl);

        // Messages
        this.client.on('message', (message) => {
            if (message.type == null) return;

            switch (message.type) {
                case "cardId":
                    // Handling this message type
                    CardIdEvent.handle(message);
                    return;
                case "processingCard":
                    ProcessingCardEvent.handle(message);
                    return;
            };
        });

        // Video Streaming
        this.client.on('stream', (frame) => {
            // Sending this frame to our Streaming Module
            StreamingStore.handleFrame(frame);
        });
    };

    public async send(message: any, eventName = "message") {
        console.log("send message:", message, eventName);
        this.client?.emit(eventName, message);
    };

    public async dispose() {
        this.client?.disconnect();
    };
};

export const WorkerConnectionStore = new WorkerConnectionStoreClass();
