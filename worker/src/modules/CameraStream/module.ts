import { Module, forwardRef } from "@nestjs/common";
import { SocketConnectionModule } from "../SocketConnection/module";

import * as Services from './services';

@Module({
    imports: [forwardRef(() => SocketConnectionModule)],
    providers: [...Object.values(Services)],
    exports: [...Object.values(Services)],
})
export class CameraModule {};