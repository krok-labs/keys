import { Injectable } from "@nestjs/common";
import { AzureEntraUserInterface, UserInterface } from "@types";
import { eq, or } from "drizzle-orm";
import { GeneralSettings } from "src/config";
import { AzureEntraSource, DrizzleDatabase } from "src/modules/Sources/services";
import { UsersModel, users } from "src/schema";

@Injectable()
export class UsersService {
    constructor(
        private readonly azureEntraSource: AzureEntraSource,
        private readonly database: DrizzleDatabase,
    ) {}

    public async getUserById(id: Number | string): Promise<UsersModel> {
        return (
            await this.database.getInstance()
                .select()
                .from(users)
                .where(
                    or(
                        eq(users.id, (id instanceof Number ? id : parseInt(id)) as number),
                        eq(users.aid, String(id)),
                    )
                )
        )[0];
    };

    public async getEntraUserFromAid(aid: string): Promise<AzureEntraUserInterface> {
        return await this.azureEntraSource.getUserById(aid);
    };

    public async resolveUserFromEntraUser(entraUser: AzureEntraUserInterface): Promise<UserInterface> {
        // HOLLY FUCKING SHIT
        let user = await this.getUserById(entraUser.aid);
        if (user == null) {
            user = await this.createNewUser(entraUser.aid);
        };

        // todo: do something idk?
        return {
            ...entraUser,
            id: user.id,
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