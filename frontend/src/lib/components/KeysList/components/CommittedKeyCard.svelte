<script lang="ts">
    import { CommittedKeyState, KeysStore, type CommittedKey } from "$lib/modules";
    import moment from "moment";
    import "moment-timezone";

    $: key = $KeysStore.find((x) => x.id == committedKey.id);
    $: contracts = key?.contracts ?? [];
    $: pickedUpAt = contracts[0]?.pickedUpAt == null ? null : moment(contracts[0]?.pickedUpAt).tz("Europe/Kyiv");

    export let committedKey: CommittedKey;
    export let size: "w-1/6" | "w-1/4" | "w-1/3" = "w-1/6";
</script>

<div class="{size} p-4">
    <div class="h-full flex flex-col bg-white rounded-xl py-4 px-6 relative">
        <!-- Header -->
        <section class="w-full flex items-center mb-4 flex-wrap gap-2">
            { #if committedKey.state == CommittedKeyState.DEPOSITED }
                <!-- Badge -->
                <span class="rounded-full px-3 py-1 bg-green-500 text-white text-xs">
                    Повернений
                </span>
            { :else }
                <!-- Badge -->
                <span class="rounded-full px-3 py-1 bg-gray-300 text-white text-xs">
                    Виданий раніше
                </span>
            { /if }
        </section>

        <!-- Text -->
        <p class="text-sm text-gray-800">{ key?.description }</p>
        <h1 class="font-bold text-2xl">{ key?.title }</h1>
        
        <section class="mt-4 flex-grow flex flex-col justify-end">
            { #if pickedUpAt != null }
                <!-- Showing contract date -->
                <div class="flex items-center bg-gray-100 rounded-2xl py-1.5 px-3">
                    <!-- Date information -->
                    <div class="ml-2">
                        <h1 class="text-sm font-medium">Виданий { pickedUpAt.format("hh:mm:ss DD/MM/YYYY") ?? "невідомо коли" }</h1>
                    </div>
                </div>
            { /if }
        </section>
    </div>
</div>