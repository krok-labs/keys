import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Inject, Logger, forwardRef } from "@nestjs/common";
import { SocketClientSubscriptions } from "../types";
import { CameraRole } from "src/modules/CameraStream/types";
import { CameraStreamerService } from "src/modules/CameraStream/services";
import { EventBusService } from "src/modules/EventBus/services";
import { SocketCommandsHelper } from "src/helpers";

interface SocketClient {
    socket: Socket,
    subscriptions: SocketClientSubscriptions[]
}

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class SocketGatewayService implements OnGatewayConnection {
    private readonly clientsMap: Map<string, SocketClient> = new Map();
    private readonly logger = new Logger(SocketGatewayService.name);

    constructor(
        private readonly eventBus: EventBusService,
    ) {
        // Subscribing to events
        this.eventBus.instance.on('message', (message) => {
            this.logger.debug(`Passing message [${JSON.stringify(message)}] to all clients`);
            
            // Passing this message to all clients
            for (const client of this.clientsMap.values()) {
                if (client.socket.connected)
                    client.socket.emit('message', message);
            };
        });

        this.eventBus.instance.on('stream', (frame) => {
            for (const client of this.clientsMap.values()) {
                if (client.subscriptions.includes(SocketClientSubscriptions.CAMERA_STREAM)) {
                    client.socket.emit('stream', frame);
                };
            }
        });
    };

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`New client connected: ${client.id}`);

        // todo: authorization

        // Saving this client to our list
        if (!this.clientsMap.has(client.id))
            this.clientsMap.set(
                client.id,
                {
                    socket: client,
                    subscriptions: [],
                }
            );
    };

    @SubscribeMessage('*')
    handleEvent(message) {
        console.log("message:", message);
    };

    @SubscribeMessage('subscribe')
    async handleSubscription(client: Socket, data: SocketClientSubscriptions) {
        if (!Object.values(SocketClientSubscriptions).includes(data as any)) {
            throw new WsException(`Invalid subscription [${data}] in subscribe command`);
        };

        // Adding this subscription to our client
        let clientEntry = this.clientsMap.get(client.id);
        if (clientEntry == null) throw new WsException(`Could not find this client: ${client.id} in client list`);

        // Checking if this client is already subscribed
        if (!clientEntry.subscriptions.includes(data)) {
            // Subscribing this client
            clientEntry.subscriptions.push(data)
        };

        // Updating client object in our list
        this.clientsMap.set(client.id, clientEntry);
    };

    @SubscribeMessage('unsubscribe')
    async handleUnsubscribe(client: Socket, data: SocketClientSubscriptions) {
        if (!Object.values(SocketClientSubscriptions).includes(data as any)) {
            throw new WsException(`Invalid subscription [${data}] in unsubscribe command`);
        };

        // Adding this subscription to our client
        let clientEntry = this.clientsMap.get(client.id);
        if (clientEntry == null) throw new WsException(`Could not find this client: ${client.id} in client list`);

        // Checking if this client is subscribed
        if (clientEntry.subscriptions.includes(data)) {
            // Unsubscribing this client
            clientEntry.subscriptions = clientEntry.subscriptions.filter((x) => x != data);
        };

        // Updating client object in our list
        this.clientsMap.set(client.id, clientEntry);
    };

    @SubscribeMessage('selectCamera')
    async handleSelectCamera(client: Socket, data: CameraRole) {
        if (!Object.values(CameraRole).includes(data)) {
            throw new WsException(`Invalid camera role [${data}] in selectCamera command`);
        };

        // Asking our CameraModule to stream different camera
        SocketCommandsHelper.selectCamera(this.eventBus.instance, data);
    };

    @SubscribeMessage('stopStreaming')
    async handleStopStreaming(client: Socket) {
        // Asking our CameraModule to stream different camera
        SocketCommandsHelper.stopStreaming(this.eventBus.instance);
    };
};
