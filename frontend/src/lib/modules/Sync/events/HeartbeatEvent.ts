import { EventType, type EventHandler } from "$lib/types";
import { SynchronizationStore, type SynchronizationStoreInterface, SynchronizationState } from "../";

export interface HeartbeatEventPayload {
    type: EventType.HEARTBEAT,
    client: string,
};

// Event handler
class HeartbeatEventClass implements EventHandler<HeartbeatEventPayload> {
    private connectedClientIds: string[] = [];
    private latestHeartbeatTime?: number;
    private heartbeatCheckerTimeout: Map<string, NodeJS.Timeout> = new Map();

    async handle(event: HeartbeatEventPayload, originalEvent: MessageEvent) {
        if (!this.connectedClientIds.includes(event.client)) this.connectedClientIds.push(event.client);

        this.latestHeartbeatTime = originalEvent.timeStamp;
        
        // Checking for too many connections condition
        if (this.connectedClientIds.length > 1) {
            SynchronizationStore.setState(SynchronizationState.TOO_MANY_CONNECTIONS);
        } else {
            SynchronizationStore.setState(SynchronizationState.CONNECTED);
        };

        // Checking for heartbeat timeout condition
        clearTimeout(this.heartbeatCheckerTimeout.get(event.client));
        this.heartbeatCheckerTimeout.set(event.client, setTimeout(() => {
            this.connectedClientIds = this.connectedClientIds.filter((x) => x != event.client);
            SynchronizationStore.setState(SynchronizationState.DISCONNECTED);
        }, 2000));
    }

    async invoke(channel: BroadcastChannel, opts: { client: string }) {
        // Invoking this event on this channel
        channel.postMessage({
            type: EventType.HEARTBEAT,
            ...opts
        } as HeartbeatEventPayload);
    };
};

export const HeartbeatEvent = new HeartbeatEventClass();
