import { ApplicationConfiguration } from "$lib/config";
import { type AllowedKeysModel, type KeysModel } from "$backend/schema";
import type { KeysControllerContract } from "$backend/modules/Keys/contracts";
import { getStore } from "$lib/helpers";
import { UserStore } from "$lib/modules/User";
import type { CommitKeyPayload } from "$backend/modules/Keys/payloads";

class KeysServiceClass {
    public async getAllKeys(): ReturnType<KeysControllerContract["getAllKeys"]> {
        // todo: error handling
        return (await fetch(`${ApplicationConfiguration.apiUrl}/keys`)).json();
    };

    public async getAllowedKeys(aid: string): Promise<Array<AllowedKeysModel & { key: KeysModel }>> {
        // todo: error handling
        return (await fetch(`${ApplicationConfiguration.apiUrl}/users/aid=${aid}/keys`)).json();
    };

    public async getById(id: number): ReturnType<KeysControllerContract['getKey']> {
        return (await fetch(`${ApplicationConfiguration.apiUrl}/keys/${id}`)).json();
    };

    public async commitKey(id: number): ReturnType<KeysControllerContract['commitKey']> {
        // Getting userId from UserStore
        const userStore = await getStore(UserStore.subscribe);
        // todo: error notifications
        if (userStore == null) throw new Error("Invalid user");
    
        return (
            await fetch(`${ApplicationConfiguration.apiUrl}/keys/${id}/commit`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userStore.id
                } satisfies CommitKeyPayload)
            })
        ).json();
    };

    public async revokeCommit(commitId: number): ReturnType<KeysControllerContract['revokeCommit']> {
        return (
            await fetch(`${ApplicationConfiguration.apiUrl}/keys/commits/${commitId}`, {
                method: 'DELETE'
            })
        ).json();
    };
};

export const KeysService = new KeysServiceClass();
