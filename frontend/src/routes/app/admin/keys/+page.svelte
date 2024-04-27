<script lang="ts">
    import type { KeysModel } from "$backend/schema";
    import { Button } from "$lib";
    import { KeysService } from "$lib/services";
    import { AllowedKeysStore, ApplicationStateStore, CurrentGuestStore, SelectedKeysStore } from "$lib/stores/shared";
    import { KeysApplicationState } from "$lib/types/state";
    import { Circle } from "svelte-loading-spinners";

    import SolarListArrowDownMinimalisticBold from '~icons/solar/list-arrow-down-minimalistic-bold';
    import SolarListArrowUpMinimalisticBold from '~icons/solar/list-arrow-up-minimalistic-bold';
    import SolarArchiveDownMinimlisticLineDuotone from '~icons/solar/archive-down-minimlistic-line-duotone';
    import SolarInboxLinear from '~icons/solar/inbox-linear';
    import SolarTrashBin2Linear from '~icons/solar/trash-bin-2-linear';

    let subheaderComponentHeight = 0;
    let isKeypickerActive = true;

    async function getKeysWithCategories() {
        const keys = await KeysService.getAllKeys();
        const map = new Map<number, Array<KeysModel>>();

        for (const key of keys) {
            if (key.floor != null) {
                map.set(key.floor, [...map.get(key.floor) ?? [], key]);
            } else {
                map.set(-1, [...map.get(-1) ?? [], key]);
            };
        };

        return [...map.entries()].sort();
    }
</script>

{ #if $ApplicationStateStore.state != KeysApplicationState.IDLE }
    <!-- Subheader with user information -->
    <header bind:clientHeight={subheaderComponentHeight} class="fixed z-20 w-full bg-gray-50 px-10 py-6 flex items-center justify-between">
        <div class="flex items-center justify-center">
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full bg-red-500"></div>

            <!-- Texts -->
            <div class="ml-3">
                <h1 class="text-xl font-medium">{ $CurrentGuestStore.displayName }</h1>

                <div class="text-sm text-gray-500 flex items-center flex-wrap">
                    { #each $CurrentGuestStore.badges as title }
                        { @const elementId = $CurrentGuestStore.badges.findIndex((x) => x == title) }

                        { #if elementId != 0 }
                            <span class="h-1 w-1 block rounded-full bg-gray-500 mx-3"></span>
                        { /if }
                        
                        <p>{ title }</p>
                    { /each }
                </div>
            </div>
        </div>

        <!-- Cancel transaction -->
        <div class="flex gap-4">
            { #if $ApplicationStateStore.state != KeysApplicationState.COMMITTING }
                <Button on:click={() => {

                }} icon={SolarArchiveDownMinimlisticLineDuotone} color="red" text="Відмінити операцію" />

                <!-- Continue to next step buutton -->
                <Button on:click={() => {
                    SelectedKeysStore.commitTransaction();
                }} icon={SolarArchiveDownMinimlisticLineDuotone} color="blue" text="Зберегти інформацію" />
            { /if }    
        </div>
    </header>
{ /if }

{ #if $ApplicationStateStore.state == KeysApplicationState.IDLE }
    <div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
        <SolarInboxLinear class="w-8 h-8" />

        <h1 class="mt-4 text-xl font-medium">Очікування користувача</h1>
    </div>
{ :else if $ApplicationStateStore.state == KeysApplicationState.PICKING }    
    <div style="padding-top: {subheaderComponentHeight}px;">
        <!-- User-picked keys -->
        <div class="px-10 py-6">
            <div class="flex items-center justify-right gap-8">
                <h1 class="text-xl font-bold">Вибрані гостем ключі</h1>
            </div>
            
            <span class="block w-full bg-gray-200 opacity-50 h-1 my-3"></span>
        
            <!-- No keys picked screen -->
            { #if $SelectedKeysStore.length == 0 }
                <div class="w-full flex flex-col items-center justify-center py-20 opacity-80">
                    <SolarInboxLinear class="w-8 h-8" />
                    
                    <h1 class="mt-4 text-xl font-medium">Гість поки що не обрав жодного ключа</h1>
                    <p class="w-1/4 text-center text-sm text-gray-800">Ключі можна обрати або на гостьовому єкрані або на цьому, прогорнувши його трошки вниз.</p>
                </div>
            { :else }
                <!-- Picked keys  -->
                <div class="w-full flex flex-wrap">
                    { #each $SelectedKeysStore as key }
                        <!-- okay???? -->
                        { @const wasSelectedByAdmin = $AllowedKeysStore.findIndex((x) => x.keyId == key.id) == -1 }

                        <div class="w-1/6 p-4">
                            <div class="bg-white rounded-xl py-4 px-6">
                                <!-- Header -->
                                <header class="w-full flex items-center mb-4">
                                    { #if wasSelectedByAdmin }
                                        <!-- Badge -->
                                        <span class="rounded-full px-3 py-1 bg-indigo-500 text-white text-xs">
                                            Тимчасовий доступ
                                        </span>
                                    { :else }
                                        <!-- Badge -->
                                        <span class="rounded-full px-3 py-1 bg-blue-500 text-white text-xs">
                                            Є доступ
                                        </span>
                                    { /if }
                                </header>
                        
                                <!-- Text -->
                                <p class="text-sm text-gray-800">{ key.description }</p>
                                <h1 class="font-bold text-2xl">{ key.title }</h1>
                        
                                <!-- Remove button -->
                                <Button on:click={() => {
                                    SelectedKeysStore.removeKey(key);
                                }} icon={SolarTrashBin2Linear} text="Видалити ключ" class="mt-6 w-full" />
                            </div>
                        </div>
                    { /each }
                </div>
            { /if }
        </div>

        <!-- Keypicker -->
        <section class="mt-6 px-10 py-6">
            <!-- Section header -->
            <div class="flex items-center justify-right gap-8">
                <h1 class="text-xl font-bold">Вибір ключей</h1>
                
                { #if isKeypickerActive }
                    <Button on:click={() => isKeypickerActive = false} color="light" icon={SolarListArrowUpMinimalisticBold} text="Сховати" class="text-sm" />
                { :else }
                    <Button on:click={() => isKeypickerActive = true} color="light" icon={SolarListArrowDownMinimalisticBold} text="Показати" class="text-sm" />
                { /if }
            </div>
            
            <span class="block w-full bg-gray-200 opacity-50 h-1 my-3"></span>

            { #if isKeypickerActive }
                <!-- Keys list -->
                { #await getKeysWithCategories() }
                    <div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
                        <Circle size={30} color={"#374151"} />
                        
                        <p class="mt-4 text-gray-700">Завантаження данних...</p>
                    </div>
                { :then floors }
                    { #each floors as floor }
                        <h1 class="text-xl font-bold">{floor[0]} поверх</h1>
                        
                        <div class="mt-6 w-full flex flex-wrap">
                            { #each floor[1] as key }
                                { @const isKeySelected = $SelectedKeysStore.findIndex((x) => x.id == key.id) == -1 ? false : true }
                                { @const isAllowed = $AllowedKeysStore.find((x) => x.keyId == key.id) ?? { isAllowed: false }.isAllowed }
                                
                                <button on:click={() => {
                                    if (!isKeySelected) SelectedKeysStore.addKey({
                                        ...key,
                                        isAllowed: true
                                    });
                                }} class="w-1/6 p-2">
                                    <div class="text-left { isKeySelected ? "bg-gray-200 cursor-not-allowed" : "bg-white" } rounded-xl py-4 px-6">
                                        <header class="w-full flex items-center mb-4">
                                            <!-- Badge -->
                                            <span class="rounded-full px-3 py-1 { isAllowed ? "bg-blue-500 text-white" : "bg-red-500 text-white" } text-xs">
                                                { isAllowed ? "Є доступ" : "Немає доступу" }
                                            </span>
                                        </header>
                                        
                                        <!-- Text -->
                                        <p class="text-sm text-gray-800">{ key.description }</p>
                                        <h1 class="font-bold text-2xl">{ key.title }</h1>
                                    </div>
                                </button>
                            { /each }
                        </div>

                        <!-- Divider -->
                        <span class="block w-full bg-gray-200 opacity-50 h-1 my-6"></span>
                    { /each }
                { /await }
            { /if }
        </section>
    </div>
{ :else if $ApplicationStateStore.state == KeysApplicationState.COMMITTING }
    <div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Circle size={30} color={"#374151"} />

        <h1 class="mt-4 text-xl font-medium">Збереження данних...</h1>
        <p class="w-1/4 text-center text-sm text-gray-800">Зберігаємо інформацію... Зазвичай це займає меньше ніж кілька секунд.</p>
    </div>
{ /if }