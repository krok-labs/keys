<script type="ts">
    import SolarKeyBold from '~icons/solar/key-bold';
    import SolarAddSquareBroken from '~icons/solar/add-square-broken';
    import SolarCardOutline from '~icons/solar/card-outline';
    import SolarQuestionCircleLinear from '~icons/solar/question-circle-linear';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { ApplicationConfiguration } from '$lib';

    import { Button } from '$lib/components';
    import { Circle } from 'svelte-loading-spinners';

    let isLoaded = false;

    onMount(() => {
        if ($ApplicationConfiguration == null) {
            goto("/");
        } else {
            isLoaded = true;
        }
    })
</script>

{ #if isLoaded }
    <main class="w-full h-screen bg-gray-100">
        <!-- Header -->
        <header class="w-full bg-white p-3 px-6 flex items-center">
            <!-- Logotype -->
            <div class="w-1/3">
                <button on:click={() => {
                    ApplicationConfiguration.clear();
                    goto('/bootstrap');
                }} class="p-2 rounded-md">
                    <SolarKeyBold class="w-7 h-7" />
                </button>
            </div>
        
            <!-- Service select -->
            <div class="w-1/3 flex justify-center gap-6">
                <Button icon={SolarAddSquareBroken} text="Видача ключей" color="blue" />
        
                <Button icon={SolarCardOutline} text="Тимчасові картки" />
            </div>
        
            <!-- Help and Other -->
            <div class="w-1/3 flex items-center justify-end">
                <Button icon={SolarQuestionCircleLinear} text="Потрібна допомога?" color="transparent" />
            </div>
        </header>
    
        <!-- Cards -->
        <section class="px-10 py-6">
            <div class="w-full h-full flex flex-wrap">
                <slot />
            </div>
        </section>
    </main>
{ :else }
    <div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Circle size={30} color={"#374151"} />
        
        <p class="mt-4 text-gray-700">Завантаження данних...</p>
    </div>
{ /if }