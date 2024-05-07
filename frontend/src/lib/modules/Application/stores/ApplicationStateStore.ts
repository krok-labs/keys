import { ApplicationType } from "$lib/types";
import { writable } from "svelte/store";
import { AbstractSharedStore, getStore } from "$lib/helpers";
import { ApplicationStateEnum } from "../types";
import { ChangeApplicationEvent, SynchronizationStore } from "$lib/modules/Sync";

interface ApplicationStateInterface {
    type: ApplicationType.KEYS,
    state: ApplicationStateEnum,
};

class ApplicationStateStoreClass extends AbstractSharedStore<ApplicationStateInterface> {
    public subscribe;
    protected update;

    protected readonly storeId = "application_state";

    constructor() {
        super();

        const { subscribe, update } = writable<ApplicationStateInterface>({
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

    public async changeApplication(app: "cards" | "keys") {
        // Getting current app side 
        ChangeApplicationEvent.invoke(SynchronizationStore.channel, { app });
    };
};

export const ApplicationStateStore = new ApplicationStateStoreClass();