import { Module } from "@nestjs/common";
import { SocketGatewayService } from "./SocketGatewayService";

@Module({
  providers: [SocketGatewayService],
  exports: [SocketGatewayService],
})
export class SocketConnectionModule {};
