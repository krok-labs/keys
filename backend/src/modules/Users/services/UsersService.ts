import { Injectable } from "@nestjs/common";
import { AzureEntraUserInterface, UserInterface } from "@types";
import { GeneralSettings } from "src/config";
import { DrizzleDatabase } from "src/modules/Sources/services";
import { users } from "src/schema";

@Injectable()
export class UsersService {
    constructor(
        private readonly database: DrizzleDatabase,
    ) {}

    public async resolveUserFromEntraUser(entraUser: AzureEntraUserInterface): Promise<UserInterface> {
        // todo: do something idk?
        return {
            ...entraUser,
            avatarUrl: `${GeneralSettings.applicationUrl}/users/aid=${entraUser.aid}/photo`,
        };
    };

    public async createNewUser(aid: string) {
        // Creating new user with this aid
        return (
            await this.database.getInstance()
                .insert(users)
                .values({
                    aid
                })
                .returning()
            )[0];
    };
};