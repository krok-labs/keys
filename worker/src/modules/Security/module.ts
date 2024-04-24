import { Module } from "@nestjs/common";

import * as Services from "./services";

@Module({
    exports: [...Object.values(Services)],
})
export class SecurityModule {};
