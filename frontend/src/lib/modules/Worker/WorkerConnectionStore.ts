import { ApplicationConfiguration } from "$lib/config";
import { io } from "socket.io-client";
import { CardIdEvent, ProcessingCardEvent } from "./events";

class WorkerConnectionStoreClass {
    private readonly client;
    
    constructor() {
        this.client = io(ApplicationConfiguration.workerUrl, { autoConnect: false });
    };

    public async initialize() {
        this.client.connect();

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
    };

    public async dispose() {};
};

export const WorkerConnectionStore = new WorkerConnectionStoreClass();
