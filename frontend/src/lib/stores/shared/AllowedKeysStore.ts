import type { AllowedKeysModel, KeysModel } from "$backend/schema";
import { writable } from "svelte/store";
import { AbstractSharedStore } from "./AbstractSharedStore";
import { getStore } from "../../../helpers";
import { CurrentGuestStore } from "./CurrentGuestStore";
import { KeysService } from "$lib/services";

export type AllowedKey = AllowedKeysModel & { key: KeysModel };

class AllowedKeysStoreClass extends AbstractSharedStore<Array<AllowedKey>> {
    public subscribe;
    protected update;

    protected readonly storeId = "allowed_keys";

    constructor() {
        super();

        const { subscribe, update } = writable<Array<AllowedKey>>([]);

        this.subscribe = subscribe;
        this.update = update;
    }

    public async fetch() {
        // Getting currently selected user from store
        const user = await getStore(CurrentGuestStore.subscribe);
        if (user == null) throw new Error("Could not fetch allowedKeys for undefined person");

        // Fetching allowedKeys
        const allowedKeys = await KeysService.getAllowedKeys(user.aid);
        console.log('fetched allowedKeys: ', allowedKeys);
        this.update(() => {
            return allowedKeys ?? [];
        });
    };
};

export const AllowedKeysStore = new AllowedKeysStoreClass();
