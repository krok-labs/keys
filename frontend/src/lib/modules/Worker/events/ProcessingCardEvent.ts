import { getStore } from "$lib/helpers";
import { ApplicationStateStore, ApplicationStateEnum } from "$lib/modules/Application";

class ProcessingCardEventClass {
    public async handle(message: { type: "processingCard" }) {
        // Checking current state
        const applicationState = await getStore(ApplicationStateStore.subscribe);

        if (applicationState.state != ApplicationStateEnum.PICKING) {
            // Updating application state
            ApplicationStateStore.setState(ApplicationStateEnum.PROCESSING_CARD);
        } else {
            // todo: sending notification to user about processing progress
        };
    };
};

export const ProcessingCardEvent = new ProcessingCardEventClass();