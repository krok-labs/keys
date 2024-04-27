import { ApplicationConfiguration } from "$lib/config";
import type { AllowedKeysModel, KeysModel } from "$backend/schema";

class KeysServiceClass {
    public async getAllKeys(): Promise<Array<KeysModel>> {
        return (await fetch(`${ApplicationConfiguration.apiUrl}/keys`)).json();
    };

    public async getAllowedKeys(aid: string): Promise<Array<AllowedKeysModel & { key: KeysModel }>> {
        return (await fetch(`${ApplicationConfiguration.apiUrl}/users/aid=${aid}/keys`)).json();
    };
};

export const KeysService = new KeysServiceClass();
