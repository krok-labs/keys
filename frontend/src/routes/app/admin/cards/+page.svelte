<script lang="ts">
    import { StreamingStore } from "$lib/modules/Streaming";
    import { onDestroy, onMount } from "svelte";

    onMount(() => {
        StreamingStore.onFrame((frame) => {
            console.log("received frame admin:", frame);
        });
    });

    onDestroy(() => {
        StreamingStore.removeAllListeners();
    });
</script>

<div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center relative">

</div>