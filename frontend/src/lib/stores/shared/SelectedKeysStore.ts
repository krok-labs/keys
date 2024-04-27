import { writable } from "svelte/store";
import type { AllowedKeysModel, KeysModel } from "$backend/schema";
import { ApplicationStateStore } from "./ApplicationStateStore";
import { KeysApplicationState } from "$lib/types";
import { AbstractSharedStore } from "./AbstractSharedStore";

export type SelectedKey = KeysModel & { isAllowed: boolean };

class SelectedKeysStoreClass extends AbstractSharedStore<Array<SelectedKey>> {
    public subscribe;
    protected update;

    protected readonly storeId = "selected_keys";

    constructor() {
        super();

        const { subscribe, update } = writable<Array<SelectedKey>>([]);

        this.subscribe = subscribe;
        this.update = update;
    };

    public async commitTransaction() {
        // Updating current application state
        ApplicationStateStore.setState(KeysApplicationState.COMMITTING);

        setTimeout(() => {
            ApplicationStateStore.setState(KeysApplicationState.IDLE);
        }, 2000);
    };

    public addKey(key: SelectedKey) {
        this.update((store) => {
            if (store.findIndex(x => x.id == key.id) == -1) store.push(key);
            return store;
        });
    };

    public removeKey(key: SelectedKey) {
        this.update((store) => {
            return store.filter((x) => x != key);
        });
    };
};

export const SelectedKeysStore = new SelectedKeysStoreClass();
