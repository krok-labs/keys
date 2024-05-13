<script lang="ts">
    import { goto } from "$app/navigation";
    import { Button } from "$lib";

    import SolarPenNewRoundLinear from '~icons/solar/pen-new-round-linear';
    import SolarSettingsLinear from '~icons/solar/settings-linear';

    import { ApplicationConfigurationStore } from "$lib/modules";
    import { onMount } from "svelte";

    onMount(() => {
        // Getting local configuration from localStorage
        if (window.localStorage.getItem('configuration') != null) {
            configurationDeclaration = window.localStorage.getItem('configuration')!;
        }
    });

    let configurationDeclaration: string = `{
    "sessionKey": "123",
    "side": "admin",
    "apiUrl": "http://192.168.1.137:3000",
    "synchronizationUrl": "http://192.168.1.137:80/synchronization",
    "workerUrl": "http://192.168.1.137:3001"
}`;
</script>

<div class="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
    <div class="md:w-1/2 lg:w-1/3 mt-6 flex flex-col gap-6 rounded-md bg-white px-4 py-6">
        <h1 class="text-xl font-medium">Файл конфігурації</h1>
        <textarea class="h-60 rounded-md bg-gray-100 p-4" placeholder="Файл конфігурації" bind:value={configurationDeclaration} />
    
        <Button on:click={() => {
            // todo: check configuration structure
            // @ts-ignore
            ApplicationConfigurationStore.setConfiguration(JSON.parse(configurationDeclaration));
            goto('/app');
        }} icon={SolarPenNewRoundLinear} text="Зберегти" />
    
        <Button on:click={() => {
            // @ts-ignore
            OpenKiosk.settings();
        }} icon={SolarSettingsLinear} text="Налаштування кіоску" />
    </div>
</div>