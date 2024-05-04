import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SocketEventsService } from "./private/SocketEventsService";
import { Logger } from "@nestjs/common";
import { SocketClientSubscriptions } from "../types";
import { CameraRole } from "src/modules/CameraStream/types";
import { CameraStreamerService } from "src/modules/CameraStream/services";

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
    private readonly clientsList: SocketClient[] = [];
    private readonly logger = new Logger(SocketGatewayService.name);

    constructor(
        // private readonly cameraStreamerService: CameraStreamerService,
        private readonly eventsService: SocketEventsService,
    ) {
        // Subscribing to events
        this.eventsService.events.on('message', (message) => {
            this.logger.debug(`Passing message [${JSON.stringify(message)}] to all clients`);
            
            // Passing this message to all clients
            for (const client of this.clientsList) {
                if (client.socket.connected)
                    client.socket.emit('message', message);
            };
        });

        this.eventsService.events.on('stream', (frame) => {
            for (const client of this.clientsList) {
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
        if (this.clientsList.findIndex(x => x.socket.id == client.id) == -1)
            this.clientsList.push({
                socket: client,
                // todo: remove
                subscriptions: [SocketClientSubscriptions.CAMERA_STREAM],
            });
    };

    @SubscribeMessage('*')
    handleEvent(message) {
        console.log("message:", message);
    };

    @SubscribeMessage('subscribe')
    async handleSubscription(client: Socket, data: string) {
        console.log('sub');
    };

    @SubscribeMessage('unsubscribe')
    async handleUnsubscribe(client: Socket, data: string) {
        console.log('unsub');
    };

    @SubscribeMessage('selectCamera')
    async handleSelectCamera(client: Socket, data: string) {
        if (!Object.keys(CameraRole).includes(data)) {
            throw new WsException(`Invalid camera role [${data}] in selectCamera command`);
        };

        // Asking our CameraModule to stream different camera
        // this.cameraStreamerService.stream(data as CameraRole);
    };
};
