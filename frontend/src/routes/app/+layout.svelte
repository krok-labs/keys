<script type="ts">
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components';
    import { SynchronizationStore, SynchronizationState, ApplicationStateStore, ApplicationConfigurationStore } from '$lib/modules';

    import KrokLogo from '$lib/assets/krok-logo.png';

    import SolarSettingsLinear from '~icons/solar/settings-linear';
    import SolarKeyBold from '~icons/solar/key-bold';
    import SolarAddSquareBroken from '~icons/solar/add-square-broken';
    import SolarQuestionCircleLinear from '~icons/solar/question-circle-linear';
    import SolarCloudCrossLinear from '~icons/solar/cloud-cross-linear';
    import SolarRestartBold from '~icons/solar/restart-bold';
    import SolarCardOutline from '~icons/solar/card-outline';

    import { page } from '$app/stores';
    import { onDestroy, onMount } from 'svelte';

    $: side = $page.route.id?.includes("admin") ? "admin" : "guest";
    $: selectedApp = $page.route.id?.includes("keys") ? "keys" : "cards";

    onMount(async () => {
        ApplicationConfigurationStore.initialize();

        // Initializing SynchronizationStore
        await SynchronizationStore.initialize();
    });
    
    onDestroy(() => {
        SynchronizationStore.dispose();
    });

    let headerComponentHeight;
</script>

<main class="w-full h-full bg-gray-100 relative">
    { #if ($SynchronizationStore.state != SynchronizationState.CONNECTED) || ($ApplicationConfigurationStore == null) }
        <div class="w-full h-screen flex flex-col items-center justify-center">
            <SolarCloudCrossLinear class="w-8 h-8" />

            <h1 class="mt-4 text-xl font-medium">Відсутнє підключення</h1>
            <p class="w-1/4 text-center text-sm text-gray-800">Відсутнє підключення до іншої сторони застосунку (гостьова або адміністративна).</p>

            <Button on:click={() => {
                goto('/bootstrap');
            }} icon={SolarRestartBold} class="mt-6" text="Переналаштувати застосунок" />
        </div>
    { :else }
        <!-- Header -->
        <header bind:clientHeight={headerComponentHeight} id="header" class="fixed z-30 w-full bg-white p-3 px-6 flex items-center justify-between">
            <!-- Logotype -->
            <div class="w-1/3">
                <button on:click={() => {
                    ApplicationStateStore.changeApplication("dashboard");
                }} class="p-2 rounded-md">
                    <img src={KrokLogo} alt="Логотип КРОКу" class="h-9" />
                </button>
            </div>

            <!-- Help and Other -->
            <div class="w-1/3 flex items-center justify-end">
                <Button on:click={() => {
                    // @ts-ignore
                    OpenKiosk.settings();
                }} icon={SolarSettingsLinear} text="Налаштування" color="transparent" />
            </div>
        </header>

        <!-- Cards -->
        <section style="padding-top: {headerComponentHeight}px">
            <slot />
        </section>
    { /if }
</main>