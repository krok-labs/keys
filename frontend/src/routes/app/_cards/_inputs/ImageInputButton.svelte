<script lang="ts">
    import { KeycardWizardStore } from "$lib/modules/Keycards";
    import { StreamingStore } from "$lib/modules/Streaming";

    import SolarRestartBold from '~icons/solar/restart-bold';
    import SolarCameraLinear from '~icons/solar/camera-linear';

    async function handle() {
        // Capturing current image
        const latestFrame = await (new Promise<string>((resolve) => {
            let listenerId: number;
            listenerId = StreamingStore.onFrame((frame) => {
                // Removing this listener
                if (listenerId != null) StreamingStore.removeListener(listenerId);

                // Returning this frame
                resolve(frame);
            });
        }))

        // Handling input
        await KeycardWizardStore.handleScannedImage(latestFrame);
    };
</script>

<div class="mx-16">
    { #if $KeycardWizardStore.currentImage != null }
        <button on:click={() => {
            KeycardWizardStore.redoImage();
        }} class="w-20 h-20 rounded-full flex items-center justify-center bg-red-500">
            <SolarRestartBold class="w-8 h-8 text-white" />
        </button>
    { :else }
        <button on:click={handle} class="flex items-center justify-center w-20 h-20 rounded-full bg-gray-400 ring-4 ring-gray-400 border-4 border-white">
            <SolarCameraLinear class="w-10 h-10 text-white" />
        </button>
    { /if }
</div>