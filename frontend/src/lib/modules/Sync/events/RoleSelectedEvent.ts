import { goto } from "$app/navigation";
import { ApplicationRole, EventType, type EventHandler } from "$lib/types";
import { SynchronizationStore } from "../SynchronizationStore";

interface RoleSelectedEventPayload {
    type: EventType.ROLE_SELECTED,
    client: string,
    role: ApplicationRole,
};

class RoleSelectedEventClass implements EventHandler<RoleSelectedEventPayload> {
    async handle(data: RoleSelectedEventPayload, event: MessageEvent<RoleSelectedEventPayload>) {
        console.log("handle:", data);
        if (data.role == ApplicationRole.ADMIN) {
            goto(`/app/guest`);
        } else {
            goto(`/app/admin`);
        }
    };

    async invoke(opts: { client: string, role: ApplicationRole }) {
        // Invoking this event on this channel
        SynchronizationStore.sendEvent({
            type: EventType.ROLE_SELECTED,
            ...opts,
        } as RoleSelectedEventPayload);
    };
};

export const RoleSelectedEvent = new RoleSelectedEventClass();