import { writable } from "svelte/store";
import type { UserInterface } from "$backend/types";
import { AbstractSharedStore } from "./AbstractSharedStore";
import { AllowedKeysStore } from "./AllowedKeysStore";

type CurrentGuestStoreInterface = UserInterface & { badges: [] };

class CurrentGuestStoreClass extends AbstractSharedStore<CurrentGuestStoreInterface> {
    public subscribe;
    protected update;

    protected readonly storeId = "current_guest";

    constructor() {
        super();

        const { subscribe, update } = writable<CurrentGuestStoreInterface>();

        this.subscribe = subscribe;
        this.update = update;
    }

    public async setUser(user: UserInterface) {
        this.update(() => {
            return {
                ...user,
                badges: [],
            };
        });

        // Fetching this user's AllowedKeys
        AllowedKeysStore.fetch();
    };

    public async runAfterInitialization() {
        // Regenerating user badges
        this.subscribers.push(
            this.subscribe((store) => {
                return {
                    ...store,
                    badges: [store?.jobTitle, store?.officeLocation, store?.userPrincipalName],
                };
            })
        );
    };
};

export const CurrentGuestStore = new CurrentGuestStoreClass();