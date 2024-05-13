import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
    namespace: "synchronization"
})
export class SynchronizationGatewayService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(SynchronizationGatewayService.name);

    private readonly declarations = new Map<string, {
        guest?: string,
        admin?: string,
        storesSnapshot: Map<string, any>
    }>();
    private readonly clients = new Map<string, Socket>();

    afterInit(server: Server) {
        this.logger.debug("Synchronization server initialized.");
    };

    // Adding this client to our clients map
    handleConnection(client: Socket, ...args: any[]) {
        try {
            this.logger.debug("New synchronization client:", client.id, ...args);
            
            this.clients.set(client.id, client);

            // Getting session store and application side from handshake
            const handshake = client.handshake;
            const sessionKey = String(handshake.query["sessionKey"]);
            const side = String(handshake.query["side"]);

            if ((sessionKey == null || side == null) || !["admin", "guest"].includes(side)) {
                throw new Error(`Invalid query parameters. sessionKey: ${sessionKey}, side: ${side}`);
            };

            // Checking if we can add this client to our clients map
            let declaration = this.declarations.get(sessionKey) ?? {
                storesSnapshot: new Map(),
            };

            // Checking if we can add this client to either admin or client side
            if ((declaration[side] == null) || declaration[side] == client.id || this.clients.get(declaration[side]) == null) {
                declaration[side] = client.id;
            } else {
                throw new Error(`Another ${side} client already connected.`);
            };

            this.declarations.set(sessionKey, declaration);
            
            this.logger.debug('New declaration created:', declaration);
        } catch(error) {
            this.logger.error(error);
            client.disconnect(true);
        }
    };

    handleDisconnect(client: Socket) {
        this.logger.debug(`Disconnected: ${client.id}`);

        // Deleting this client from our clients store
        this.clients.delete(client.id);
    }

    private updateStoreSnapshot(sessionKey: string, storeId: string, data: any) {
        const declaration = this.declarations.get(sessionKey) ?? {
            storesSnapshot: new Map(),
        };

        declaration.storesSnapshot.set(storeId, data);
        this.declarations.set(sessionKey, declaration);
    };

    @SubscribeMessage('event')
    handleEvent(
        client: Socket,
        message: any
    ) {
        // Finding this client and it's session declaration
        for (const [sessionKey, declaration] of this.declarations.entries()) {
            console.log("")
            if (declaration.admin == client.id || declaration.guest == client.id) {
                // Sending this event
                const side = declaration.admin == client.id ? "admin" : "guest";
                const sendTo = side == "admin" ? "guest" : "admin";
                const sendToClient = this.clients.get(declaration[sendTo]);

                if (sendToClient == null) throw new Error(`Can not send event to ${sendTo}: ${sendToClient?.id}`);

                sendToClient.emit('event', message);

                // Sniffing this event (if it's a SyncStore event)
                if (message?.type == "sync_store" && (message.storeId != null && message.data != null)) {
                    // Updating store snapshot
                    this.updateStoreSnapshot(sessionKey, message.storeId, message.data);
                };
                
                return;
            };
        };
    };

    @SubscribeMessage('getStoresSnapshot')
    handleSnapshotEvent(
        client: Socket,
    ) {
        for (const [_, declaration] of this.declarations.entries()) {
            if (declaration.admin == client.id || declaration.guest == client.id) {
                // Sending storesSnapshot to this client
                client.emit('storesSnapshot', declaration.storesSnapshot ?? {});

                return;
            };
        };
    };
};
