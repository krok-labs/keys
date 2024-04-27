import { ApplicationType, type ApplicationRole, KeysApplicationState } from "$lib/types";
import type { Unsubscriber } from "svelte/motion";
import { writable } from "svelte/store";
import { AbstractSharedStore } from "./AbstractSharedStore";

interface KeysApplicationStateInterface {
    type: ApplicationType.KEYS,
    state: KeysApplicationState,
};

class ApplicationStateStoreClass extends AbstractSharedStore<KeysApplicationStateInterface> {
    public subscribe;
    protected update;

    protected readonly storeId = "application_state";

    constructor() {
        super();

        const { subscribe, update } = writable<KeysApplicationStateInterface>({
            type: ApplicationType.KEYS,
            state: KeysApplicationState.IDLE
        });

        this.update = update;
        this.subscribe = subscribe;
    };

    public setState(state: KeysApplicationState) {
        this.update((obj) => {
            return {
                ...obj,
                state
            };
        });
    }
};

export const ApplicationStateStore = new ApplicationStateStoreClass();