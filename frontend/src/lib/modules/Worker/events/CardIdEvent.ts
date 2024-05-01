import { getStore } from "$lib/helpers";
import { ApplicationStateStore, KeysApplicationState } from "$lib/modules/Application";
import { KeysStore } from "$lib/modules/Keys";
import { KeycardsService, UserStore } from "$lib/modules/User";

class CardIdEventClass {
    public async handle(message: { type: "cardId", cardId: string }) {
        const cardId = parseInt(message.cardId);
        console.debug(`[WorkerConnectionStore.CardIdEvent.handle] Handling card event with cardId: [${cardId}]`);
    
        // Trying to check what type of card this is:
        // 1. Trying to find this card in our KeysStore
        // 2. Trying to ask our backend on /keycard/{:id} route about this
        //    person's card

        const applicationState = await getStore(ApplicationStateStore.subscribe);

        // Refetching keys (@huskie do we really need this?)
        await KeysStore.fetch();
        const keys = await getStore(KeysStore.subscribe);

        // todo: check if there are more than one entries for this card?
        const key = keys.find((x) => x.nfcId == cardId);

        if (key != null) {
            // Checking application state
            if (applicationState.state == KeysApplicationState.PICKING) {
                // Asking SelectedKeysStore to add this key
                await UserStore.selectedKeys.addKeyById(key.id, "admin");
            };
        } else {
            if (applicationState.state != KeysApplicationState.PICKING) {
                // Asking our backend to get
                const users = await KeycardsService.getUsersFromKeycard(cardId);

                console.debug(`[WorkerConnectionStore.CardIdEvent.handle] Got these users from KeycardService: [${JSON.stringify(users)}]`);
                
                // todo: multiple users
                await UserStore.setUser(users[0]);
                ApplicationStateStore.setState(KeysApplicationState.PICKING);
            };
        }
    };
};

export const CardIdEvent = new CardIdEventClass();