import { ApplicationRole } from "$lib/types";
import type { Unsubscriber } from "svelte/motion";
import { writable } from "svelte/store";

interface ApplicationConfigurationInterface {
    role: ApplicationRole
};

const STORAGE_PATH = "applicationConfiguration";

class ApplicationConfigurationClass {
    public subscribe;
    private update;
    private subscribers: Array<Unsubscriber> = [];

    constructor() {
        const { subscribe, update } = writable<ApplicationConfigurationInterface | null>(null);
        this.subscribe = subscribe;
        this.update = update;
    }

    // bootstrap
    public async bootstrap(role?: ApplicationRole) {
        if (role) {
            this.update(() => {
                return {
                    role
                };
            });
        };

        // Unsubbing
        for (const unsubscribe of this.subscribers) {
            unsubscribe();
        };

        // Listening to store changes
        this.subscribers.push(this.subscribe((store) => {
            console.log("store:", store);
            if (store != null) this.saveToLocalStorage(store);
        }));
    };

    // saveToLocalStorage
    private saveToLocalStorage(store: ApplicationConfigurationInterface) {
        localStorage.setItem(STORAGE_PATH, JSON.stringify(store));
    };

    // fetchFromLocalStorage
    public async fetchFromLocalStorage() {
        // Trying to fetch information from localStorage
        try {
            // todo: check consistency
            const savedStore = JSON.parse(localStorage.getItem(STORAGE_PATH) ?? "");
            
            this.update(() => {
                return savedStore;
            });

            // Bootstrapping application
            this.bootstrap();

            return true;
        } catch(error) {
            return false;
        };
    };

    public clear() {
        this.update(() => {
            return null;
        });
    }
};

export const ApplicationConfiguration = new ApplicationConfigurationClass();
