import { Module } from "@nestjs/common";
import { SocketConnectionModule } from "../SocketConnection/module";

import * as Controllers from "./controllers";

@Module({
    imports: [SocketConnectionModule],
    controllers: [...Object.values(Controllers)],
})
export class MockModule {};
