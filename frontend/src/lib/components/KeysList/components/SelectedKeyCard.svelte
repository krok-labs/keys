<script lang="ts">
    import { Button } from "$lib/components/Button";
    import { KeysStore, SelectedKeyState, UserStore, type SelectedKey } from "$lib/modules";

    import SolarTrashBin2Linear from '~icons/solar/trash-bin-2-linear';

    $: key = $KeysStore.find((x) => x.id == selectedKey.id);

    const AllowedKeysStore = UserStore.allowedKeys;

    export let selectedKey: SelectedKey;
    export let side: "admin" | "guest" = "guest";
    export let size: "w-1/6" | "w-1/4" | "w-1/3" = "w-1/6";
</script>

<div class="{size} p-2">
    <div class="h-full flex flex-col bg-white rounded-xl py-4 px-6 relative">
        <!-- Header -->
        <section class="w-full flex items-center mb-4 flex-wrap gap-2">
            { #if selectedKey.state == SelectedKeyState.CONFIRMATION_REQUIRED }
                <!-- Badge -->
                <span class="rounded-full px-3 py-1 bg-yellow-500 text-white text-xs">
                    Потребує підтвердження
                </span>
            { :else if selectedKey.state == SelectedKeyState.COMMITTED }
                <!-- Badge -->
                <span class="rounded-full px-3 py-1 bg-green-500 text-white text-xs">
                    Виданний
                </span>
            { /if }

            <!-- Checking if user has access to this key -->
            { #if selectedKey.state == SelectedKeyState.CONFIRMATION_REQUIRED && !($AllowedKeysStore.find((x) => x.keyId == selectedKey.id)?.isAllowed ?? false) }
                <!-- Badge -->
                <span class="rounded-full px-3 py-1 bg-red-500 text-white text-xs">
                    Немає доступу
                </span>
            { /if }
        </section>

        <!-- Text -->
        <p class="text-sm text-gray-800">{ key?.description }</p>
        <h1 class="font-bold text-2xl">{ key?.title }</h1>
        
        <section class="mt-4 flex-grow flex flex-col justify-end">
            { #if selectedKey.state == SelectedKeyState.COMMITTED }
                <!-- { @const contract = key?.contracts[0] } -->
            
                <!-- Showing contract date -->
                <div class="flex items-center bg-gray-100 rounded-2xl py-1.5 px-3">
                    <!-- Date information -->
                    <div class="ml-2">
                        <h1 class="text-xs font-semibold">Виданий { key?.contracts[0]?.pickedUpAt ?? "невідомо коли" }</h1>
                    </div>
                </div>
            { :else if selectedKey.state == SelectedKeyState.CONFIRMATION_REQUIRED }
                <!-- Remove button -->
                <Button on:click={() => {
                    // todo: check if this key is committed?
                    UserStore.selectedKeys.removeKey(selectedKey.id);
                }} icon={SolarTrashBin2Linear} text="Видалити" />
            { /if }
        </section>
    </div>
</div>