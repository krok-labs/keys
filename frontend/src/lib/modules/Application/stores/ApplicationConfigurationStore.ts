import { goto } from "$app/navigation";
import { writable } from "svelte/store";

export interface ApplicationConfigurationInterface {
    sessionKey: string,
    side: "admin" | "guest",
    apiUrl: string,
    synchronizationUrl: string,
    workerUrl: string
};

class ApplicationConfigurationStoreClass {
    public subscribe;
    protected update;

    constructor() {
        const { subscribe, update } = writable<ApplicationConfigurationInterface>();

        this.subscribe = subscribe;
        this.update = update;
    };

    public initialize() {
        // Getting current configuration from localStorage
        if (window.localStorage.getItem('configuration') != null) {
            this.setConfiguration(JSON.parse(window.localStorage.getItem('configuration')!) as ApplicationConfigurationInterface);
        } else {
            goto('/bootstrap');
        }
    }

    public setConfiguration(configuration: ApplicationConfigurationInterface) {
        this.update(() => {
            return configuration;
        });

        // Saving this configuration to local storage
        window.localStorage.setItem('configuration', JSON.stringify(configuration));
    };

};

export const ApplicationConfigurationStore = new ApplicationConfigurationStoreClass();