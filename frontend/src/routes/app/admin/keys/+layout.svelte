<script lang="ts">
    import { UserStore, SynchronizationStore, SynchronizationState, KeysStore } from "$lib/modules";
    import { onDestroy, onMount } from "svelte";
    import { Circle } from "svelte-loading-spinners";

    let isLoading = true;

    const STORES = [UserStore, KeysStore];

    onMount(async () => {
        // Initializing admin stores
        for (const store of STORES) {
            await store.initialize();
        };

        SynchronizationStore.subscribe((store) => {
            if ([SynchronizationState.DISCONNECTED, SynchronizationState.TOO_MANY_CONNECTIONS].includes(store.state)) {
                // Disposing of all stores
                for (const store of STORES) {
                    store.dispose();
                };
            };
        });

        isLoading = false;
    });

    onDestroy(() => {
        for (const store of STORES) {
            store.dispose();
        };
    });
</script>

{ #if !isLoading }
    <slot />
{ :else }
    <div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Circle size={30} color={"#374151"} />
        
        <p class="mt-4 text-gray-700">Завантаження данних...</p>
    </div>
{ /if }
