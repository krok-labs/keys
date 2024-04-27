<script lang="ts">
    import { Button } from "$lib";
    import { AllowedKeysStore, ApplicationStateStore, CurrentGuestStore, SelectedKeysStore } from "$lib/stores/shared";
    import { KeysApplicationState } from "$lib/types";
    import { Circle } from "svelte-loading-spinners";

    import SolarAddSquareLinear from '~icons/solar/add-square-linear';
    import SolarTrashBin2Linear from '~icons/solar/trash-bin-2-linear';

    let subheaderComponentHeight = 0;
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
    </header>
{ /if }

{ #if $ApplicationStateStore.state == KeysApplicationState.IDLE }
    <div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center relative">
        <!-- todo: background -->

        <div class="flex flex-col items-center justify-center">
            <div class="flex items-center justify-center gap-4">
                <h1 class="text-4xl font-bold">Відскануйте картку тут</h1>
                <img src="https://em-content.zobj.net/source/microsoft/379/backhand-index-pointing-right_1f449.png" alt="pointing hand emoji" class="w-16 h-16 rotate-45">
            </div>
            
            <p class="w-1/3 text-center text-2xl text-gray-800">Скануйте свою картку та вибирайте ключі, які вам потрібно прямо на єкрані! Нічого складного - все просто та прозоро.</p>
        </div>
    </div>
{ :else if $ApplicationStateStore.state == KeysApplicationState.PICKING }
    <div class="h-screen" style="padding-top: {subheaderComponentHeight}px;">
        <!-- User-picked keys -->
        <div class="px-10 py-6">
            <div class="flex items-center justify-right gap-8">
                <h1 class="text-xl font-bold">Вибрані вами ключі</h1>
            </div>
            
            <span class="block w-full bg-gray-200 opacity-50 h-1 my-3"></span>
        
            <!-- Picked keys  -->
            <div class="w-full flex flex-wrap">
                { #each $SelectedKeysStore as key }
                    <!-- okay???? -->
                    { @const wasSelectedByAdmin = $AllowedKeysStore.findIndex((x) => x.keyId == key.id) == -1 }

                    <div class="w-1/6 p-4">
                        <div class="bg-white rounded-xl py-4 px-6">
                            <header class="w-full flex items-center mb-4">
                                { #if wasSelectedByAdmin }
                                    <!-- Badge -->
                                    <span class="rounded-full px-3 py-1 bg-indigo-500 text-white text-xs">
                                        Тимчасовий доступ
                                    </span>
                                { :else }
                                    <!-- Badge -->
                                    <span class="rounded-full px-3 py-1 bg-green-500 text-white text-xs">
                                        Вибрано
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

                { #each $AllowedKeysStore as allowedKey }
                    { @const isInSelectedKeys = $SelectedKeysStore.findIndex((x) => x.id == allowedKey.keyId) != -1 }
                
                    { #if !isInSelectedKeys }
                        <div class="w-1/6 p-4">
                            <div class="bg-gray-50 opacity-80 rounded-xl py-4 px-6">
                                <header class="w-full flex items-center mb-4">
                                    <!-- Badge -->
                                    <span class="rounded-full px-3 py-1 bg-blue-500 text-white text-xs">
                                        Є доступ
                                    </span>
                                </header>

                                <!-- Text -->
                                <p class="text-sm text-gray-800">{ allowedKey.key.description }</p>
                                <h1 class="font-bold text-2xl">{ allowedKey.key.title }</h1>
                        
                                <!-- Add key button -->
                                <Button on:click={() => {
                                    SelectedKeysStore.addKey({
                                        ...allowedKey.key,
                                        isAllowed: true
                                    });
                                }} icon={SolarAddSquareLinear} text="Вибрати" class="mt-6 w-full" />
                            </div>
                        </div>
                    { /if }
                { /each }
            </div>
        </div>
    </div>
{ /if }