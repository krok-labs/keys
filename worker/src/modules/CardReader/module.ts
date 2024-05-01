import { Module } from "@nestjs/common";
import { CardReaderService } from "./CardReaderService";
import { SocketConnectionModule } from "../SocketConnection/module";

@Module({
  imports: [SocketConnectionModule],
  providers: [CardReaderService],
})
export class CardReaderModule {};
