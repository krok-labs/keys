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
    private readonly INTERNAL_STORES = [this.allowedKeys, this.selectedKeys, this.committedKeys]

    constructor() {
        super();

        const { subscribe, update } = writable<UserStoreInterface>();
        
        this.subscribe = subscribe;
        this.update = update;
    };

    public clear() {
        // @ts-ignore
        this.update(() => (undefined));
        this.syncUpdates();
    }

    public runAfterDispose(): void {
        // Disposing of all internal stores
        for (const store of this.INTERNAL_STORES) {
            store.dispose();
        };
    }

    public async setUser(user: UserInterface) {
        this.update(() => {
            return {
                ...user,
                badges: [String(user.jobTitle), String(user.officeLocation), String(user.userPrincipalName)],
            };
        });

        this.syncUpdates();

        // Clearing all store
        this.selectedKeys.clear();
        this.allowedKeys.clear();

        // Fetching allowed keys
        await this.allowedKeys.fetch();
        await this.committedKeys.fetch();
    };

    public async runAfterInitialization() {
        // Initializing internal stores
        for (const store of this.INTERNAL_STORES) {
            store.initialize();
        };
    };
};

export const UserStore = new UserStoreClass();