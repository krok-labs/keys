import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { AzureEntraSource, MockFirebirdService } from "src/modules/Sources/services";
import { UsersService } from "src/modules/Users/services";

@Controller("/keycard")
export class KeycardController {
    constructor(
        private readonly firebirdSource: MockFirebirdService,
        private readonly azureEntraSource: AzureEntraSource,
        private readonly usersService: UsersService,
    ) {}

    @Get("/:id")
    public async getKeycardUsers(
        @Param("id", ParseIntPipe) keycardId: number
    ) {
        // Using firebird service to get name, surname and last name
        // of this keycard's owner
        const username = await this.firebirdSource.resolveNameFromKeycard(keycardId);

        // Getting Azure Entra accounts associated with this account
        return await Promise.all(
            (await this.azureEntraSource.searchUserByName(username))
                .map(async entraUser => (await this.usersService.resolveUserFromEntraUser(entraUser)))
        );
    };
};
