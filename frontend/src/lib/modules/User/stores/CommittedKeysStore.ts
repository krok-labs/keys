import { AbstractSharedStore, getStore } from "$lib/helpers";
import { KeysStore } from "$lib/modules/Keys";
import { writable } from "svelte/store";
import type { UserStore } from "../UserStore";

type CommittedKeysStoreInterface = number[];

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
            }).map((x) => x.id)
        ));
    };
};
