import { Controller, Get } from "@nestjs/common";
import { KeysService } from "src/modules/Cards/services";
import { AllowedKeysModel, KeysModel } from "src/schema";

@Controller("/users/:id")
export class UsersController {
    constructor(
        private readonly keysService: KeysService,
    ) {}

    @Get('/keys')
    public async getAllowedKeys(): Promise<Array<AllowedKeysModel & { key: KeysModel }>> {
        // todo: get user from id
        return await this.keysService.getAllowedKeysFromAid("85f4808b-7e9d-4523-9659-407262f31054");
    };
};
