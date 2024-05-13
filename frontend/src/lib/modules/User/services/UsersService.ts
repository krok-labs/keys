import type { UsersControllerContract } from "$backend/modules/Users/contracts";
import { getStore } from "$lib/helpers";
import { ApplicationConfigurationStore } from "$lib/modules/Application";

class UsersServiceClass {
    private async getApiUrl(): Promise<string> {
        const configuration = await getStore(ApplicationConfigurationStore.subscribe);
        if (configuration == null) throw new Error("[UsersService.getApiUrl] Empty configuration");

        return configuration.apiUrl;
    };

    public async getById(id: string): ReturnType<UsersControllerContract["getById"]> {
        // todo: error handling
        if (!id.startsWith("id=") && !id.startsWith("aid=")) {
            id = `aid=${id}`;
        };

        return (await fetch(`${await this.getApiUrl()}/users/${id}`)).json();
    };
};

export const UsersService = new UsersServiceClass();
