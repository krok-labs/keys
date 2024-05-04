import { AbstractSharedStore, getStore } from "$lib/helpers";
import { KeysStore } from "$lib/modules/Keys";
import { writable } from "svelte/store";
import type { UserStore } from "../UserStore";

export interface CommittedKey {
    id: number;
    state: CommittedKeyState;
};

export enum CommittedKeyState {
    DEPOSITED = 'deposited',
    CURRENTLY_HOLDING = 'currently_holding',
};

type CommittedKeysStoreInterface = CommittedKey[];

export class CommittedKeysStoreClass extends AbstractSharedStore<CommittedKeysStoreInterface> {
    public subscribe;
    protected update;

    protected readonly storeId = "committed_keys";
    private userStore;
    
    constructor(userStore: typeof UserStore) {
        super();

        this.userStore = userStore;

        const { subscribe, update } = writable<CommittedKeysStoreInterface>();

        this.subscribe = subscribe;
        this.update = update;
    }

    public async fetch() {
        // todo: fetch from api instead of computing on-the-fly
        const keys = await getStore(KeysStore.subscribe);
        const user = await getStore(this.userStore.subscribe);
        
        this.update(() => (
            keys.filter((x) => {
                if (x.contracts.filter((y) => y.userId == user.id && y.state == 'CURRENTLY_HOLDING').length > 0) return true;
                return false;
            }).map((x) => ({
                id: x.id,
                state: CommittedKeyState.CURRENTLY_HOLDING,
            }))
        ));
    };

    public async removeIfNeeded(keyId: number) {
        this.update((store) => (
            store.filter((x) => x.id != keyId)
        ));
    }

    public async setKeyState(keyId: number, state: CommittedKeyState) {
        // Checking if we have this key in store
        const store = await getStore(this.subscribe);

        // todo: throw error
        if (store.findIndex(x => x.id == keyId) == -1) return;
    
        this.update((store) => {
            return [
                ...store.filter(x => x.id != keyId),
                {
                    id: keyId,
                    state: state,
                },
            ];
        });
    }
};
