import type { Invalidator, Subscriber, Unsubscriber } from "svelte/store";

export function getStore<T>(subscribe: (this: void, subscribe: Subscriber<T>, invalidate?: Invalidator<T>) => Unsubscriber): Promise<T> {
    return new Promise((resolve) => {
        let unsubscribe: Unsubscriber;
        unsubscribe = subscribe((data) => {
            if (unsubscribe != null) unsubscribe();
            resolve(data);
        });
    });
};
