import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import * as Services from "./services";
import * as Controllers from "./controllers";
import { SystemAuthorizationMiddleware } from "../Security/middlewares";
import { SecurityModule } from "../Security/module";

@Module({
    imports: [
        // required for SystemAuthorizationMiddleware
        SecurityModule
    ],
    providers: [...Object.values(Services)],
    controllers: [...Object.values(Controllers)],
    exports: [...Object.values(Services)],
})
export class CardsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Applying middlewares
        consumer
            .apply(SystemAuthorizationMiddleware)
            .forRoutes('cards')
    }
};
