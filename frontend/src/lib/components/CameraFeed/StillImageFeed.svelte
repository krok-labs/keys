<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let isScreenFlashShown = true;

    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;
    let classes = "";

    onMount(() => {
        context = canvas.getContext('2d');

        if (context == null || stillImage == null) return;

        try {
            var imageObj = new Image();
            imageObj.src = stillImage;
            imageObj.onload = function() {
                context?.drawImage(imageObj, 0, 0, width, height);
            };
        } catch(e) {};

        setTimeout(() => {
            isScreenFlashShown = false;
        }, 500);
    });

    export let width = 1920;
    export let height = 1080;
    export let stillImage: string | undefined;
    export { classes as class };
</script>

{ #if isScreenFlashShown }
    <div out:fade class="absolute z-20 bg-white"></div>
{ /if }

<canvas bind:this={canvas} class="{classes} w-full h-full z-0" id="stillImage" {width} {height}></canvas>