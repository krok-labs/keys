<script lang="ts">
    import { StreamingStore } from "$lib/modules/Streaming";
    import { onDestroy, onMount } from "svelte";

    let canvas: HTMLCanvasElement;

    onMount(() => {
        const context = canvas.getContext('2d');

        StreamingStore.onFrame((frame) => {
            if (context == null) return;

            try {
                var imageObj = new Image();
                imageObj.src = "data:image/jpeg;base64," + frame;
                imageObj.onload = function() {
                    context.drawImage(imageObj, 0, 0, 1920, 1080);
                };
            } catch(e){ }
        });
    });

    onDestroy(() => {
        StreamingStore.removeAllListeners();
    });
</script>

<div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center relative">
    <canvas bind:this={canvas} class="bg-red-500" id="video" width={1920} height={1080}></canvas>
</div>