import { Module, forwardRef } from "@nestjs/common";
import { SocketConnectionModule } from "../SocketConnection/module";
import { EventBusModule } from "../EventBus/module";

import * as Services from './services';

@Module({
    imports: [EventBusModule],
    providers: [...Object.values(Services)],
    exports: [...Object.values(Services)],
})
export class CameraModule {};