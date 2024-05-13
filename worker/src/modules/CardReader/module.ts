import { Module } from "@nestjs/common";
import { CardReaderService } from "./CardReaderService";
import { EventBusModule } from "../EventBus/module";

@Module({
  imports: [EventBusModule],
  providers: [CardReaderService],
})
export class CardReaderModule {};
