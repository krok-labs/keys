import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway(80)
export class SocketGatewayService implements OnGatewayConnection {
    handleConnection(client: Socket, ...args: any[]) {
        console.log("Client connected:");
        console.log(client.id);
    };

    @SubscribeMessage('')
    handleEvent() {

    };
};
