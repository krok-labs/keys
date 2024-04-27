import { KeycardsService } from "$lib/services";
import { ApplicationStateStore, CurrentGuestStore } from "$lib/stores/shared";
import { KeysApplicationState } from "$lib/types";

class WorkerConnectionStoreClass {
    public async processKeycard(keycardId: number) {
        // Getting information about this keycard
        const relatedUsers = await KeycardsService.getUsersFromKeycard(keycardId);

        // todo: multiple users?
        const user = relatedUsers[0];
        
        // Populating our CurrentGuestStore
        CurrentGuestStore.setUser(user);

        // Updating application state
        ApplicationStateStore.setState(KeysApplicationState.PICKING);
    }

    // initialize
    // |
    public async initialize() {
        // mock
        // setTimeout(() => {
        //     console.log('mock');
        //     this.processKeycard(1234);
        // }, 2000);

        return true;
    };

    // dispose
    // | 
    public async dispose() {

    };
};

export const WorkerConnectionStore = new WorkerConnectionStoreClass();
