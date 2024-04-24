import { Module } from "@nestjs/common";
import { CardReaderService } from "./CardReaderService";

@Module({
  providers: [CardReaderService],
})
export class CardReaderModule {};
