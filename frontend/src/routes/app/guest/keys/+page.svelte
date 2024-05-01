<script lang="ts">
    import { CommittedKeyCard, SelectedKeyCard, AllowedKeyCard } from "$lib";
    import { ApplicationStateStore, UserStore, KeysApplicationState } from "$lib/modules";
    import { Circle } from "svelte-loading-spinners";

    const SelectedKeysStore = UserStore.selectedKeys;
    const AllowedKeysStore = UserStore.allowedKeys;
    const CommittedKeysStore = UserStore.committedKeys;

    let subheaderComponentHeight = 0;
</script>

{ #if [KeysApplicationState.PICKING].includes($ApplicationStateStore.state) }
    { #if $UserStore != null }
        <!-- Subheader with user information -->
        <header bind:clientHeight={subheaderComponentHeight} class="fixed z-20 w-full bg-gray-50 px-10 py-6 flex items-center justify-between">
            <div class="flex items-center justify-center">
                <!-- Avatar -->
                <div class="w-10 h-10 rounded-full bg-red-500"></div>

                <!-- Texts -->
                <div class="ml-3">
                    <h1 class="text-xl font-medium">{ $UserStore.displayName }</h1>

                    <div class="text-sm text-gray-500 flex items-center flex-wrap">
                        { #each $UserStore.badges as title }
                            { @const elementId = $UserStore.badges.findIndex((x) => x == title) }

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
{ :else if $ApplicationStateStore.state == KeysApplicationState.PROCESSING_CARD }
    <div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Circle size={30} color={"#374151"} />
        
        <p class="mt-4 text-gray-700">Завантаження данних...</p>
    </div>
{ :else if $ApplicationStateStore.state == KeysApplicationState.PICKING }
    <div class="h-screen" style="padding-top: {subheaderComponentHeight}px;">
        <!-- User-picked keys -->
        <div class="px-10 py-6 flex gap-8">
            <!-- Picked Keys -->
            <div class="w-1/2">
                <div class="flex items-center justify-right gap-8">
                    <h1 class="text-xl font-bold">Вибрані вами ключі</h1>
                </div>
                
                <span class="block w-full bg-gray-200 opacity-50 h-1 my-3"></span>
            
                <!-- Picked keys  -->
                <div class="w-full flex items-stretch flex-wrap">
                    <!-- Selected -->
                    { #each $SelectedKeysStore ?? [] as key }
                        <SelectedKeyCard size="w-1/3" selectedKey={key} />
                    { /each }

                    <!-- Allowed -->
                    { #each $AllowedKeysStore ?? [] as allowedKey }
                        { @const isInSelectedKeys = $SelectedKeysStore.findIndex((x) => x.id == allowedKey.keyId) != -1 }
                    
                        { #if !isInSelectedKeys }
                            <AllowedKeyCard size="w-1/3" {allowedKey} />
                        { /if }
                    { /each }
                </div>
            </div>

            <!-- Committed Keys -->
            <div class="w-1/2">
                <div class="flex items-center justify-right gap-8">
                    <h1 class="text-xl font-bold">Видані раніше ключі</h1>
                </div>
                
                <span class="block w-full bg-gray-200 opacity-50 h-1 my-3"></span>
                
                <div class="w-full flex items-stretch flex-wrap">
                    { #each $CommittedKeysStore ?? [] as keyId }
                        <CommittedKeyCard size="w-1/3" {keyId} />
                    { /each }
                </div>
            </div>
        </div>
    </div>
{ /if }