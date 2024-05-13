import { Module } from "@nestjs/common";
import { EventBusModule } from "../EventBus/module";

import * as Controllers from "./controllers";

@Module({
    imports: [EventBusModule],
    controllers: [...Object.values(Controllers)],
})
export class MockModule {};
