import { Module } from "@nestjs/common";

import * as Services from "./services";
import * as Controllers from "./controllers";

@Module({
    providers: [...Object.values(Services)],
    controllers: [...Object.values(Controllers)],
    exports: [...Object.values(Services)],
})
export class UsersModule {};
