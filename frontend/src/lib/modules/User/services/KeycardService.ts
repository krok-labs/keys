import type { UserInterface } from "$backend/types";
import { ApplicationConfiguration } from "$lib/config";

class KeycardsServiceClass {
    public async getUsersFromKeycard(keycardId: number): Promise<Array<UserInterface>> {
        return (await fetch(`${ApplicationConfiguration.apiUrl}/keycard/${keycardId}`)).json();
    };
};

export const KeycardsService = new KeycardsServiceClass();
