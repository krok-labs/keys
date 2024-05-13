import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { getStore } from "$lib/helpers";
import { EventHandler, EventType } from "$lib/types";
import { SynchronizationStore } from "../SynchronizationStore";

interface ChangeApplicationEventPayload {
    app: "keys" | "cards"
};

class ChangeApplicationEventClass implements EventHandler<ChangeApplicationEventPayload> {
    async handle(data: ChangeApplicationEventPayload, event?: MessageEvent<ChangeApplicationEventPayload>) {
        // Getting current appplication side
        const pageStore = await getStore(page.subscribe);
        const side = pageStore.route.id?.includes("admin") ? "admin" : "guest";

        goto(`/app/${side}/${data.app}`);
    };

    async invoke(opts: ChangeApplicationEventPayload) {
        SynchronizationStore.sendEvent({
            type: EventType.CHANGE_APPLICATION,
            ...opts
        })

        await this.handle(opts, undefined);
    };
}

export const ChangeApplicationEvent = new ChangeApplicationEventClass();