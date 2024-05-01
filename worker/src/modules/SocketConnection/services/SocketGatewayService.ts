import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SocketEventsService } from "./private/SocketEventsService";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class SocketGatewayService implements OnGatewayConnection {
    private readonly clientsList: Socket[] = [];
    private readonly logger = new Logger(SocketGatewayService.name);

    constructor(
        private readonly eventsService: SocketEventsService,
    ) {
        // Subscribing to events
        this.eventsService.events.on('message', (message) => {
            this.logger.debug(`Passing message [${JSON.stringify(message)}] to all clients`);
            
            // Passing this message to all clients
            for (const client of this.clientsList) {
                if (client.connected)
                    client.emit('message', message);
            };
        });
    };

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`New client connected: ${client.id}`);

        // Saving this client to our list
        if (this.clientsList.findIndex(x => x.id == client.id) == -1)
            this.clientsList.push(client);
    };

    @SubscribeMessage('*')
    handleEvent(message) {
        console.log("message:", message);
    };
};
