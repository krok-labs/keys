import { ApplicationConfiguration } from "$lib/config";
import { type AllowedKeysModel, type KeysModel } from "$backend/schema";
import type { KeysControllerContract } from "$backend/modules/Keys/contracts";
import { getStore } from "$lib/helpers";
import { UserStore } from "$lib/modules/User";
import type { CommitKeyPayload } from "$backend/modules/Keys/payloads";
import { KeysStore } from "../stores";

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

    public async depositKey(keyId: number) {
        return (
            await fetch(`${ApplicationConfiguration.apiUrl}/keys/${keyId}/deposit`, {
                method: 'POST'
            })
        ).json();
    };

    public async isAvailable(keyId: number): Promise<boolean> {
        // todo: use api instead of store?
        const store = await getStore(KeysStore.subscribe);
        const key = store.find((x) => x.id == keyId);

        // todo: throw error?
        if (key == null) return true;

        return !(key.contracts.filter((x) => x.state == 'CURRENTLY_HOLDING').length > 0);
    };

    public async canDeposit(keyId: number) {
        // todo: use api instead of store?
        
        // Getting user
        const user = await getStore(UserStore.subscribe);
        const keys = await getStore(KeysStore.subscribe);

        const key = keys.find((x) => x.id == keyId);
        // todo: throw error
        if (key == null) return;

        // Checking if this user can return this key
        return (key.contracts.filter((x) => x.userId == user.id && x.state == 'CURRENTLY_HOLDING').length > 0);
    };
};

export const KeysService = new KeysServiceClass();
