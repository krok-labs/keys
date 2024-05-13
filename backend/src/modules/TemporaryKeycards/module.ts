import { Module } from "@nestjs/common";
import { SourcesModule } from "../Sources/module";

import * as Controllers from "./controllers";
import * as Services from "./services";

@Module({
    imports: [SourcesModule],
    controllers: [...Object.values(Controllers)],
    providers: [...Object.values(Services)]
})
export class TemporaryKeycardsModule {};
