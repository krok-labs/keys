import { Module } from "@nestjs/common";

import { SourcesModule, UsersModule } from "..";
import * as Controllers from "./controllers";

@Module({
    imports: [SourcesModule, UsersModule],
    controllers: [...Object.values(Controllers)],
})
export class KeycardModule {};
