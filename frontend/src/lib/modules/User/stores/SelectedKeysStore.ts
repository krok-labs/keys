import { writable } from "svelte/store";
import { AbstractSharedStore, getStore } from "$lib/helpers";
import type { UserStore } from "../UserStore";
import { KeysService, KeysStore } from "$lib/modules/Keys";

export enum SelectedKeyState {
    CONFIRMATION_REQUIRED = 'confirmation_required',
    COMMITTED = 'committed',
};

export type SelectedKey = {
    id: number,
    isAllowed: boolean,
    state: SelectedKeyState,
}

export class SelectedKeysStoreClass extends AbstractSharedStore<Array<SelectedKey>> {
    public subscribe;
    protected update;

    protected readonly storeId = "selected_keys";

    private readonly commitsMap: Map<number, number> = new Map();
    private userStore;

    constructor(userStore: typeof UserStore) {
        super();

        this.userStore = userStore;

        const { subscribe, update } = writable<Array<SelectedKey>>([]);

        this.subscribe = subscribe;
        this.update = update;
    };

    public async commitKey(keyId: number) {
        // Finding this key
        // Adding this commitId to commitsMap
        const contract = await KeysService.commitKey(keyId);
        this.commitsMap.set(keyId, contract.id);

        // Refetching info about this key
        await KeysStore.refetchKey(keyId);
    };

    public async revokeKey(keyId: number) {
        // Finding this key's commit
        const commitId = this.commitsMap.get(keyId);
        if (commitId == null) return false;

        // Revoking this key
        await KeysService.revokeCommit(commitId);

        // Refetching info about this key
        await KeysStore.refetchKey(keyId);
        return true;
    };

    public async revokeAll() {
        // Revoking all transactions
    }

    public async addKeyById(id: number, side: "guest" | "admin") {
        // Trying to find this key in our store
        const allowedKeys = await getStore(this.userStore.allowedKeys.subscribe);
        const store = await getStore(this.subscribe);
        const key = store.find((x) => x.id == id);

        if (key != null) {
            switch (key.state) {
                // Approving this key
                case SelectedKeyState.CONFIRMATION_REQUIRED:
                    if (side != "admin") return;

                    await this.commitKey(id);
                    await this.setKeyState(id, SelectedKeyState.COMMITTED);

                    break;

                // Revoking this key
                case SelectedKeyState.COMMITTED:
                    if (side != "admin") return;

                    // Removing this key from store
                    await this.revokeKey(id);
                    this.removeKey(id);

                    break;
            };
        } else {
            // Adding this key to our store
            if (side == "admin") {
                // Adding and committing this key
                this.addKey(id, true, SelectedKeyState.CONFIRMATION_REQUIRED);

                if (allowedKeys.find(x => x.keyId == id)?.isAllowed) {
                    this.setKeyState(id, SelectedKeyState.COMMITTED);
                    await this.commitKey(id);
                };
            } else {
                // Adding with { state: CONFIRMATION_REQUIRED }
                // Checking if we have permissions for this key
                if (allowedKeys.find(x => x.keyId == id)?.isAllowed) {
                    this.addKey(id, true, SelectedKeyState.CONFIRMATION_REQUIRED);
                } else {
                    // todo: send notification to guest side
                }
            };
        };
    };

    public removeKey(id: number) {
        this.update((store) => {
            return store.filter(x => x.id != id);
        });
    };

    private addKey(id: number, isAllowed: boolean, state: SelectedKeyState) {
        this.update((store) => {
            return [
                ...store,
                {
                    id,
                    isAllowed,
                    state
                },
            ];
        });
    };

    private async setKeyState(keyId: number, state: SelectedKeyState) {
        // Checking if we have this key in store
        const store = await getStore(this.subscribe);

        // todo: throw error
        if (store.findIndex(x => x.id == keyId) == -1) return;
    
        this.update((store) => {
            return [
                ...store.filter(x => x.id != keyId),
                {
                    id: keyId,
                    isAllowed: store.find(x => x.id == keyId)!.isAllowed,
                    state: state,
                },
            ];
        });
    }

    public clear() {
        this.update(() => {
            return [];
        });
    }
};
