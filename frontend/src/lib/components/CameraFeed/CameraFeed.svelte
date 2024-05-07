<script lang="ts">
    import { StreamingStore } from "$lib/modules/Streaming";
    import { onDestroy, onMount } from "svelte";

    let canvas: HTMLCanvasElement;
    let classes = "";

    onMount(() => {
        const context = canvas.getContext('2d');

        StreamingStore.onFrame((frame) => {
            if (context == null) return;

            try {
                var imageObj = new Image();
                imageObj.src = frame;
                imageObj.onload = function() {
                    context.drawImage(imageObj, 0, 0, width, height);
                };
            } catch(e){ }
        });
    });
    
    onDestroy(() => {
        StreamingStore.removeAllListeners();
    });

    export let width = 1920;
    export let height = 1080;
    export { classes as class };
</script>

<canvas bind:this={canvas} class="{classes} z-0" id="video" {width} {height}></canvas>