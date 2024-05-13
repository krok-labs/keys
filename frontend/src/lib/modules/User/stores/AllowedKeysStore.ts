import type { AllowedKeysModel } from "$backend/schema";
import { writable } from "svelte/store";
import { getStore, AbstractSharedStore } from "$lib/helpers";
import { KeysService } from "$lib/modules/Keys";
import type { UserStore } from "../UserStore";

export type AllowedKey = AllowedKeysModel;

export class AllowedKeysStoreClass extends AbstractSharedStore<Array<AllowedKey>> {
    public subscribe;
    protected update;

    protected readonly storeId = "allowed_keys";

    private userStore;

    constructor(userStore: typeof UserStore) {
        super();
        
        this.userStore = userStore;

        const { subscribe, update } = writable<Array<AllowedKey>>([]);

        this.subscribe = subscribe;
        this.update = update;
    }

    public async fetch() {
        // Getting currently selected user from store
        const user = await getStore(this.userStore.subscribe);
        if (user == null) throw new Error("Could not fetch allowedKeys for undefined person");

        // Fetching allowedKeys
        const allowedKeys = await KeysService.getAllowedKeys(user.aid);
        this.update(() => {
            return allowedKeys ?? [];
        });

        this.syncUpdates();
    };

    public clear() {
        this.update(() => {
            return [];
        });

        this.syncUpdates();
    }
};
