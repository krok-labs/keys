import { ApplicationType } from "$lib/types";
import { writable } from "svelte/store";
import { AbstractSharedStore } from "$lib/helpers";
import { ApplicationStateEnum } from "../types";

interface ApplicationStateEnumInterface {
    type: ApplicationType.KEYS,
    state: ApplicationStateEnum,
};

class ApplicationStateStoreClass extends AbstractSharedStore<ApplicationStateEnumInterface> {
    public subscribe;
    protected update;

    protected readonly storeId = "application_state";

    constructor() {
        super();

        const { subscribe, update } = writable<ApplicationStateEnumInterface>({
            type: ApplicationType.KEYS,
            state: ApplicationStateEnum.IDLE
        });

        this.update = update;
        this.subscribe = subscribe;
    };

    public setState(state: ApplicationStateEnum) {
        this.update((obj) => {
            return {
                ...obj,
                state
            };
        });
    }
};

export const ApplicationStateStore = new ApplicationStateStoreClass();