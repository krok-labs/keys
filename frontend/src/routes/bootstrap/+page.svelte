<script lang="ts">
    import { Button, SynchronizationStore } from "$lib";
    import { ApplicationRole, SynchronizationState } from "$lib/types";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { RoleSelectedEvent } from "$lib/stores/sync/events";

    // chooseRole
    function chooseRole(role: ApplicationRole) {
        // Sending RoleSelected event
        RoleSelectedEvent.invoke(SynchronizationStore.channel, { client: SynchronizationStore.clientId, role });
        goto(`/app/${role.toString()}`);
    };
</script>

<div class="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
    { #if [SynchronizationState.WAITING, SynchronizationState.DISCONNECTED].includes($SynchronizationStore.state) }
        <h1 class="mt-4 text-xl font-medium">Очікування підключення...</h1>
        <p class="w-1/4 text-center text-sm text-gray-800">Для того, щоб продовжити вам потрібно відкрити ще одне браузерне вікно з данним застосунком.</p>
    { :else if $SynchronizationStore.state == SynchronizationState.CONNECTED }
        <div class="w-1/4 mt-6 flex flex-col gap-6 rounded-md bg-white px-4 py-6">
            <h1 class="text-center mt-4 text-xl font-medium">Виберіть роль цього застосунку</h1>
            <p class="text-center text-sm text-gray-800">Тепер, для того, щоб продовжити, вам потрібно обрати роль цієї частини застосунку.</p>    

            <!-- Guest role -->
            <button on:click={() => {
                chooseRole(ApplicationRole.GUEST);
            }} class="text-left bg-blue-400 hover:bg-blue-500 text-white rounded-md p-4">
                <h1 class="text-xl font-medium">Гостьова роль</h1>
                <p class="text-sm text-gray-200">Гостьова сторона застосунку відображається гостям.</p>
            </button>

            <!-- Admin role -->
            <button on:click={() => {
                chooseRole(ApplicationRole.ADMIN);
            }} class="text-left bg-indigo-500 hover:bg-indigo-600 text-white rounded-md p-4">
                <h1 class="text-xl font-medium">Адміністративна роль</h1>
                <p class="text-sm text-gray-200">Підключається до зчитувачів та камер, передає інформацію до гостоьової сторони на відображення та виконує інші адміністративні функції.</p>
            </button>
        </div>
    { :else if $SynchronizationStore.state == SynchronizationState.TOO_MANY_CONNECTIONS }
        <h1 class="mt-4 text-xl font-medium">Занадто багато підключень.</h1>
        <p class="w-1/4 text-center text-sm text-gray-800">Закрийте зайві браузерні вікна з цим застосунком або перезавантажте їх.</p>
    { /if }
</div>