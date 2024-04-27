import type { Invalidator, Subscriber, Updater } from "svelte/store";
import { StoreUpdateEvent } from "../sync/events";
import { SynchronizationStore } from "../sync";
import type { Unsubscriber } from "svelte/motion";

export abstract class AbstractSharedStore<T> {
    abstract subscribe: (this: void, subscriber: Subscriber<T>, invalidator?: Invalidator<T>) => Unsubscriber;
    protected abstract update: (this: void, updater: Updater<T>) => void;
    protected abstract storeId: string;

    protected readonly subscribers: Unsubscriber[] = [];

    protected wasStoreUpdated = false;
    
    public async initialize() {
        // Listening to store updates
        StoreUpdateEvent.onUpdate(this.storeId, (data) => {
            this.wasStoreUpdated = true;
            this.updateHandler.bind(this)(data);
        });
        
        this.subscribers.push(
            this.subscribe((data) => {
                if (this.wasStoreUpdated) {
                    this.wasStoreUpdated = false;
                    return;
                }

                // Invoking update event
                StoreUpdateEvent.invoke(SynchronizationStore.channel, {
                    storeId: this.storeId,
                    data
                });
            })
        );
    }

    public runAfterInitialization() {};

    private updateHandler(this: AbstractSharedStore<T>, data: any) {
        console.debug(`[AbstractSharedStore.updateHandler] Update store ${this.storeId} with data: ${ JSON.stringify(data) }`)

        // Blindly updating this store with new data
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