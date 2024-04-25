import { Injectable } from "@nestjs/common";
import { AzureEntraUserInterface, UserInterface } from "@types";
import { GeneralSettings } from "src/config";

@Injectable()
export class UsersService {
    public async resolveUserFromEntraUser(entraUser: AzureEntraUserInterface): Promise<UserInterface> {
        // todo: do something idk?
        return {
            ...entraUser,
            avatarUrl: `${GeneralSettings.applicationUrl}/users/aid=${entraUser.aid}/photo`,
        };
    };
};