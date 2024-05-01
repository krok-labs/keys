import { getStore } from "$lib/helpers";
import { ApplicationStateStore, KeysApplicationState } from "$lib/modules/Application";

class ProcessingCardEventClass {
    public async handle(message: { type: "processingCard" }) {
        // Checking current state
        const applicationState = await getStore(ApplicationStateStore.subscribe);

        if (applicationState.state != KeysApplicationState.PICKING) {
            // Updating application state
            ApplicationStateStore.setState(KeysApplicationState.PROCESSING_CARD);
        } else {
            // todo: sending notification to user about processing progress
        };
    };
};

export const ProcessingCardEvent = new ProcessingCardEventClass();