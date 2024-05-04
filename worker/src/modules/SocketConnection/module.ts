import { Module, forwardRef } from "@nestjs/common";

import * as Services from './services';
import * as PrivateServices from './services/private';
import { CameraModule } from "../CameraStream/module";

@Module({
  imports: [forwardRef(() => CameraModule)],
  providers: [...Object.values(Services), ...Object.values(PrivateServices)],
  exports: [...Object.values(Services)],
})
export class SocketConnectionModule {};
