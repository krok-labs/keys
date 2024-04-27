import { Module, forwardRef } from "@nestjs/common";

import * as Services from "./services";
import * as Controllers from "./controllers";
import { KeysModule } from "../Cards/module";
import { SourcesModule } from "../Sources/module";

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
