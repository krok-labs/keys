import { MiddlewareConsumer, Module, NestModule, forwardRef } from "@nestjs/common";

import * as Services from "./services";
import * as Controllers from "./controllers";

import { SystemAuthorizationMiddleware } from "../Security/middlewares";
import { SecurityModule } from "../Security/module";
import { SourcesModule } from "../Sources/module";
import { UsersModule } from "../Users/module";

@Module({
    imports: [
        // required for SystemAuthorizationMiddleware
        SecurityModule,

        // required for KeysService
        SourcesModule,
        forwardRef(() => UsersModule),
    ],
    providers: [...Object.values(Services)],
    controllers: [...Object.values(Controllers)],
    exports: [...Object.values(Services)],
})
export class KeysModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Applying middlewares
        // consumer
        //     .apply(SystemAuthorizationMiddleware)
        //     .forRoutes('keys')
    }
};
