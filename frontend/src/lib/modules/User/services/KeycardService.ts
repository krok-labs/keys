import type { UserInterface } from "$backend/types";
import { getStore } from "$lib/helpers";
import { ApplicationConfigurationStore } from "$lib/modules/Application";

class KeycardsServiceClass {
    private async getApiUrl(): Promise<string> {
        const configuration = await getStore(ApplicationConfigurationStore.subscribe);
        if (configuration == null) throw new Error("[KeysService.getApiUrl] Empty configuration");

        return configuration.apiUrl;
    };

    public async getUsersFromKeycard(keycardId: number): Promise<Array<UserInterface>> {
        return (await fetch(`${await this.getApiUrl()}/keycard/${keycardId}`)).json();
    };
};

export const KeycardsService = new KeycardsServiceClass();
