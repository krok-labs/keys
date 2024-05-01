import type { Invalidator, Subscriber, Updater } from "svelte/store";
import { StoreUpdateEvent, type StoreUpdateEventPayload } from "$lib/modules/Sync";
import { SynchronizationStore } from "$lib/modules/Sync";
import type { Unsubscriber } from "svelte/motion";
import { getStore } from "./getStore";
import { page } from "$app/stores";

export abstract class AbstractSharedStore<T> {
    abstract subscribe: (this: void, subscriber: Subscriber<T>, invalidator?: Invalidator<T>) => Unsubscriber;
    protected abstract update: (this: void, updater: Updater<T>) => void;
    protected abstract storeId: string;

    protected readonly subscribers: Unsubscriber[] = [];

    protected wasStoreUpdated = false;
    
    public async initialize() {
        console.debug(`[AbstractSharedStore.initialize] Initializing store with id [${this.storeId}]`);

        const appStore = await getStore(page.subscribe);

        // Listening to localStorage updates
        window.addEventListener('storage', async (storageEvent) => {
            if (storageEvent.key != this.storeId) return;
            console.debug(`[AbstractSharedStore.storageEvent] Store [${this.storeId}] received new storage event: [${JSON.stringify(storageEvent)}]`);

            // Checking if our store needs an update
            const store = await getStore(this.subscribe);
            if (store != storageEvent.newValue) {
                console.debug(`[AbstractSharedStore.storageEvent] Updating store [${this.storeId}]`);
                
                // Updating our store
                this.update(() => (JSON.parse(storageEvent.newValue ?? "{}") as T));
            };
        });

        // Subscribing to store updates
        this.subscribers.push(this.subscribe((store) => {
            // Updating value in localStorage
            console.debug(`[AbstractSharedStore.subscribe] Saving [${this.storeId}] data to localStorage: [${JSON.stringify(store)}]`);
            localStorage.setItem(this.storeId, JSON.stringify(store));
        }));

        // Listening to store updates
        // StoreUpdateEvent.onUpdate(this.storeId, (data, event) => {
        //     if (data.senderUrl == appStore.route.id) {
        //         console.debug(`[AbstractSharedStore.StoreUpdateEvent.onUpdate] Ignoring store [${this.storeId}] update [${JSON.stringify(data)}]`);
        //         return;
        //     }

        //     this.updateHandler.bind(this)(data.data);
        // });
        
        // this.subscribers.push(
        //     this.subscribe((data) => {
        //         if (this.wasStoreUpdated) {
        //             console.debug(`[AbstractSharedStore.subscribe] Store [${this.storeId}] was recently updated. Returning.`);
        //             this.wasStoreUpdated = false;
        //             return;
        //         }

        //         // Invoking update event
        //         console.debug(`[AbstractSharedStore.subscribe] Sending update of store [${this.storeId}] with data: ${JSON.stringify(data)}`)
        //         StoreUpdateEvent.invoke(SynchronizationStore.channel, {
        //             storeId: this.storeId,
        //             senderUrl: String(appStore.route.id),
        //             data,
        //         });
        //     })
        // );

        this.runAfterInitialization();
    }

    public runAfterInitialization() {};

    private updateHandler(this: AbstractSharedStore<T>, data: any) {
        console.debug(`[AbstractSharedStore.updateHandler] Update store [${this.storeId}] with data: ${ JSON.stringify(data) }`)

        // Blindly updating this store with new data
        this.wasStoreUpdated = true;
        this.update(() => {
            return data as T;
        });
    };

    public async dispose() {
        for (const unsubscribe of this.subscribers) {
            unsubscribe();
        };
    };
};