import { Module } from "@nestjs/common";

import * as Services from './services';
import * as PrivateServices from './services/private';

@Module({
  providers: [...Object.values(Services), ...Object.values(PrivateServices)],
  exports: [...Object.values(Services)],
})
export class SocketConnectionModule {};
