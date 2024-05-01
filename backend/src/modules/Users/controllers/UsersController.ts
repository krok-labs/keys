import { Controller, Get, Param } from "@nestjs/common";
import { UserInterface } from "@types";
import { KeysService } from "src/modules/Keys/services";
import { AllowedKeysModel, KeysModel, UsersModel } from "src/schema";
import { UsersControllerContract } from "../contracts";
import { UsersService } from "../services";

@Controller("/users/:id")
export class UsersController implements UsersControllerContract {
    constructor(
        private readonly usersService: UsersService,
        private readonly keysService: KeysService,
    ) {}

    @Get()
    public async getById(
        @Param("id") id: string
    ): Promise<UserInterface> {
        const user = await this.getUserFromId(id);
        const entraUser = await this.usersService.getEntraUserFromAid(user.aid);
        return await this.usersService.resolveUserFromEntraUser(entraUser);
    };

    @Get('/keys')
    public async getAllowedKeys(
        @Param("id") id: string
    ): Promise<Array<AllowedKeysModel & { key: KeysModel }>> {
        const user = await this.getUserFromId(id);
        return await this.keysService.getAllowedKeys(user);
    };

    private async getUserFromId(id: string): Promise<UsersModel> {
        if (id.startsWith("id=")) {
            id = id.replaceAll("id=", "");
            return await this.usersService.getUserById(parseInt(id));
        } else if (id.startsWith("aid=")) {
            id = id.replaceAll("aid=", "");
            return await this.usersService.getUserById(id);
        } else {
            throw new Error('Invalid id schema');
        };
    };
};
