import { writable } from "svelte/store";
import { AbstractSharedStore, getStore } from "$lib/helpers";
import { ApplicationStateEnum } from "../types";
import { ChangeApplicationEvent, SynchronizationStore, type ChangeApplicationEventPayload } from "$lib/modules/Sync";

interface ApplicationStateInterface {
    state: ApplicationStateEnum,
};

class ApplicationStateStoreClass extends AbstractSharedStore<ApplicationStateInterface> {
    public subscribe;
    protected update;

    protected readonly storeId = "application_state";

    constructor() {
        super();

        const { subscribe, update } = writable<ApplicationStateInterface>({
            state: ApplicationStateEnum.IDLE,
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

        this.syncUpdates();
    };

    public async changeApplication(app: ChangeApplicationEventPayload["app"]) {
        // Getting current app side 
        ChangeApplicationEvent.invoke({ app });
    };

    public clear() {
        this.update(() => ({ state: ApplicationStateEnum.IDLE }));
        this.syncUpdates();
    }
};

export const ApplicationStateStore = new ApplicationStateStoreClass();