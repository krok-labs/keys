<script lang="ts">
    import { onMount } from "svelte";

    import SolarCursorLinear from '~icons/solar/cursor-linear';
    import SolarKeyBold from '~icons/solar/key-bold';
    import SolarCard2Broken from '~icons/solar/card-2-broken';
    import { ApplicationStateStore } from "$lib/modules";

    let header: HTMLElement | null;

    const cards = [
        {
            type: "app-big",
            app: "cards",
            size: "w-2/6",
            isAvailable: true,

            icon: SolarCard2Broken,
            iconColor: "text-orange-500",
            title: "Тимчасові перепустки",
            description: "Немає перепустки? Не проблема - в данному сервіси Ви просто зможете створити тимчасову перепустку.",
        },
        {
            type: "app-big",
            app: "keys",
            size: "w-2/6",
            isAvailable: false,

            icon: SolarKeyBold,
            iconColor: "text-purple-500",
            title: "Видача ключей",
            description: "Електронна видача ключей, перегляд журналу та подібні інші функції.",
        },
        {
            type: "static",
            title: "Є пропозиція?",
            description: "Є якісь зауваження або пропозиції? Розповідайте про них охороні, і ми потім їх реалізуємо!",
            size: "w-1/6"
        }
    ]

    onMount(() => {
        header = document.getElementById("header");
    });

    export let side: "admin" | "guest";
</script>

<div class="absolute overflow-hidden top-0 w-full h-screen flex bg-gray-100" style="padding-top: {header?.clientHeight}px;">
    <!-- Cards -->
    <section class="w-full h-min flex flex-wrap items-center justify-start p-4">
        <!-- Keys -->
        { #each cards as card }
            <div class="{ card.size } h-52 relative p-3">
                <button on:click={() => {
                    // if (card.app != null && card.isAvailable) {
                    if (card.app != null) {
                        // @ts-ignore
                        ApplicationStateStore.changeApplication(card.app);
                    }
                }} class="text-left flex flex-col justify-start w-full h-full rounded-xl active:bg-gray-100 bg-white { card.isAvailable ?? true ? "" : "opacity-40" } shadow-2xl p-4">
                    <!-- Static card -->
                    { #if card.type == "static" }
                        <div class="w-full h-full flex items-center justify-center p-2">
                            <div class="text-center">
                                <h1 class="text-xl font-bold">{ card.title }</h1>
                                <p class="text-sm text-gray-700">{ card.description }</p>
                            </div>
                        </div>
                    <!-- App card -->
                    { :else if card.type == "app-big" }
                        <!-- Header -->
                        <div class="w-full flex justify-between items-center text-gray-700">
                            <h1 class="text-sm font-semibold">Сервіс</h1>

                            <SolarCursorLinear class="w-5 h-5" />
                        </div>

                        <!-- App Information -->
                        <div class="flex items-center justify-start mt-2">
                            <svelte:component this={card.icon} class="w-7 h-7 mr-2 { card.iconColor }" />

                            <h1 class="text-2xl font-bold">{ card.title }</h1>
                        </div>

                        <p class="text-base text-gray-700">{ card.description }</p>
                    { /if }

                    { #if !(card.isAvailable ?? true) }
                        <div class="flex-grow flex items-end">
                            <div class="rounded-full bg-red-500 px-4 py-1.5">
                                <p class="text-sm text-white">В розробці</p>
                            </div>
                        </div>
                    { /if }
                </button>
            </div>
        { /each }
    </section>
</div>
