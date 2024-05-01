import type { UserInterface } from "$backend/types";
import { AbstractSharedStore } from "$lib/helpers";
import { writable } from "svelte/store";
import { AllowedKeysStoreClass, CommittedKeysStoreClass, SelectedKeysStoreClass } from "./stores";

export type UserStoreInterface = UserInterface & { badges: Array<string> };

// Root User Store
class UserStoreClass extends AbstractSharedStore<UserStoreInterface> {
    public subscribe;
    protected update;

    // Substores
    public readonly allowedKeys = new AllowedKeysStoreClass(this);
    public readonly selectedKeys = new SelectedKeysStoreClass(this);
    public readonly committedKeys = new CommittedKeysStoreClass(this);

    protected readonly storeId = "user";

    constructor() {
        super();

        const { subscribe, update } = writable<UserStoreInterface>();
        
        this.subscribe = subscribe;
        this.update = update;
    };

    public async setUser(user: UserInterface) {
        this.update(() => {
            return {
                ...user,
                badges: [String(user.jobTitle), String(user.officeLocation), String(user.userPrincipalName)],
            };
        });

        // Clearing all store
        this.selectedKeys.clear();
        this.allowedKeys.clear();

        // Fetching allowed keys
        await this.allowedKeys.fetch();
        await this.committedKeys.fetch();
    };

    public async runAfterInitialization() {
        // Initializing internal stores
        const INTERNAL_STORES = [this.allowedKeys, this.selectedKeys, this.committedKeys];

        for (const store of INTERNAL_STORES) {
            store.initialize();
        };
    };
};

export const UserStore = new UserStoreClass();