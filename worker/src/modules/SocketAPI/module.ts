import { Module } from "@nestjs/common";

import * as Services from "./services";

@Module({
    providers: [...Object.values(Services)]
})
export class SocketAPIModule {};
