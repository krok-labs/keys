import { AbstractSharedStore, getStore } from "$lib/helpers";
import { writable } from "svelte/store";
import { KeysService } from "../services";

type KeysStoreInterface = Awaited<ReturnType<typeof KeysService["getAllKeys"]>>;

class KeysStoreClass extends AbstractSharedStore<KeysStoreInterface> {
    public subscribe;
    protected update;

    protected readonly storeId = "keys";

    constructor() {
        super();

        const { subscribe, update } = writable<KeysStoreInterface>([]);

        this.subscribe = subscribe;
        this.update = update;
    }

    public clear() {
        this.update(() => ([]));
        this.syncUpdates();
    };

    public async refetchKey(id: number) {
        // todo: refetch key individually
        await this.fetch();
    };

    public async fetch() {
        const keys = await KeysService.getAllKeys();
        this.update(() => {
            return keys;
        });
        
        this.syncUpdates();
    };

    public async getAll() {
        return await getStore(this.subscribe);
    };
};

export const KeysStore = new KeysStoreClass();
