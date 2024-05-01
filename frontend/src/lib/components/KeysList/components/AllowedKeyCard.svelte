<script lang="ts">
    import { Button } from "$lib";
    import { KeysStore, UserStore, UsersService, type AllowedKey } from "$lib/modules";

    import SolarAddSquareLinear from '~icons/solar/add-square-linear';

    $: key = $KeysStore.find((x) => x.id == allowedKey.keyId);

    export let allowedKey: AllowedKey;
    export let size: "w-1/6" | "w-1/4" | "w-1/3" = "w-1/6";
</script>

{ #if key != null && key.contracts?.length == 0 }
    <div class="{size} p-4">
        <div class="h-full bg-gray-50 opacity-80 rounded-xl py-4 px-6">
            <header class="w-full flex items-center mb-4">
                <!-- Badge -->
                <span class="rounded-full px-3 py-1 { allowedKey.isAllowed ? "bg-blue-500 text-white" : "bg-red-500 text-white" } text-xs">
                    { allowedKey.isAllowed ? "Є доступ" : "Немає доступу" }
                </span>
            </header>

            <!-- Text -->
            <p class="text-sm text-gray-800">{ key?.description }</p>
            <h1 class="font-bold text-2xl">{ key?.title }</h1>

            <!-- Add key button -->
            <Button on:click={() => {
                UserStore.selectedKeys.addKeyById(key.id, "guest");
            }} icon={SolarAddSquareLinear} text="Вибрати" class="mt-6 w-full" />
        </div>
    </div>
{ /if }