import { Module, forwardRef } from "@nestjs/common";
import { KeysModule } from "../Keys/module";
import { SourcesModule } from "../Sources/module";

import * as Services from "./services";
import * as Controllers from "./controllers";

@Module({
    imports: [
        SourcesModule,
        forwardRef(() => KeysModule),
    ],
    providers: [...Object.values(Services)],
    controllers: [...Object.values(Controllers)],
    exports: [...Object.values(Services)],
})
export class UsersModule {};
