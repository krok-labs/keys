<script lang="ts">
    import { Button, CameraFeed, StillImageFeed } from "$lib/components";
    import ImageInputButton from "./_inputs/ImageInputButton.svelte";
    import { onMount } from "svelte";

    import SolarCheckReadLinear from '~icons/solar/check-read-linear';
    import SolarMapArrowDownLinear from '~icons/solar/map-arrow-down-linear';
    import SolarMenuDotsBold from '~icons/solar/menu-dots-bold';
    import SolarAltArrowRightLinear from '~icons/solar/alt-arrow-right-linear';
    import SolarCloseCircleLinear from '~icons/solar/close-circle-linear';
    import SolarCameraSquareLinear from '~icons/solar/camera-square-linear';

    import { KeycardWizardStore } from "$lib/modules/Keycards";
    import { WizardInputType } from "$lib/modules/Keycards/types";
    import { ApplicationStateStore, StreamingStore } from "$lib/modules";

    let header: HTMLElement | null;

    // todo: do something if step not found
    $: currentStep = $KeycardWizardStore.steps.find((x) => x.id == $KeycardWizardStore.currentStepId);

    onMount(() => {
        header = document.getElementById("header");
        StreamingStore.start("face_scanner");
    });

    export let side: "admin" | "guest";
</script>

<div class="absolute overflow-hidden w-full h-screen bg-gray-100 flex items-start justify-start top-0 pb-6" style="padding-top: {header?.clientHeight}px;">
    <!-- Instructions -->
    <div class="z-20 w-1/3 flex flex-col h-full bg-white rounded-r-3xl mt-3">
        <!-- Steps header -->
        <section class="p-12 flex items-start justify-center">
            { #each $KeycardWizardStore.steps as step }
                { @const stepIndex = $KeycardWizardStore.steps.findIndex((x) => x.id == step.id) }
                { @const isLastElement = stepIndex == $KeycardWizardStore.steps.length - 1 }

                { @const isCurrentStep = stepIndex == $KeycardWizardStore.currentStepId }
                { @const isCompletedStep = stepIndex < $KeycardWizardStore.currentStepId }

                <div class="text-center">
                    <!-- Icon -->
                    <div class="ml-[auto] mr-[auto] w-min rounded-full flex items-center justify-center { isCompletedStep ? "bg-green-500" : (isCurrentStep ? "border-2 border-green-500" : "border-2 border-gray-400") } p-3">
                        { #if isCompletedStep }
                            <SolarCheckReadLinear class="w-6 h-6 text-white" />
                        { :else if isCurrentStep }
                            <SolarMapArrowDownLinear class="w-6 h-6 text-green-500" />
                        { :else }
                            <SolarMenuDotsBold class="w-6 h-6 text-gray-600" />
                        { /if }
                    </div>

                    <!-- Step info -->
                    <p class="mt-3 text-sm text-gray-700">{stepIndex + 1} крок</p>
                    <h1 class="text-md font-medium text-black">{ step.title }</h1>
                </div>

                <!-- Next step line -->
                { #if !isLastElement }
                    <div class="mt-5 mx-2 w-20 { isCompletedStep ? "bg-green-500" : "bg-gray-400" } h-1 rounded-full"></div>
                { /if }
            { /each }
        </section>
        
        <!-- Instructions -->
        <section class="p-12 flex-grow overflow-auto">
            <h1 class="text-4xl text-black font-bold">{ currentStep?.title }</h1>
            <p class="mt-4 text-md text-gray-700">{ @html currentStep?.content }</p>
        </section>

        <!-- Footer -->
        { #if side == "admin" }
            <section class="p-12 gap-6 flex items-center justify-center">
                <!-- Cancel -->
                <Button on:click={() => {
                    ApplicationStateStore.changeApplication('dashboard');
                }} color="red" text="Відминити" icon={SolarCloseCircleLinear} />

                { #if currentStep?.inputType == WizardInputType.IMAGE }
                    <!-- Make a photo -->
                    <ImageInputButton />
                { /if }

                <!-- Continue (if photo exists) -->
                <Button on:click={() => {
                    if ($KeycardWizardStore.isNextStepAvailable) KeycardWizardStore.nextStep();
                }} disabled={!$KeycardWizardStore.isNextStepAvailable} color={ $KeycardWizardStore.isNextStepAvailable ? "blue" : "gray" } text="Продовжити" icon={SolarAltArrowRightLinear} />
            </section>
        { /if }
    </div>

    <!-- Camera Feed -->
    { #if $KeycardWizardStore.currentStepId == 2 }
        <!-- Showing images -->
        <div class="w-2/3 py-6 h-full px-20 flex items-center justify-center gap-8 relative overflow-auto">
            { #each [
                {
                    image: $KeycardWizardStore.documentsImage, 
                    title: "Фотографія документів",
                    description: "На фотографії документів має читатись основна інформація про гостя - ім'я, фамілія та подібні данні.",
                },
                {
                    image: $KeycardWizardStore.faceImage,
                    title: "Фотографія обличчя",
                    description: "На фотографії обличчя має бути видно обличчя гостя, котрому видається картка",
                }] as scan }
                <div class="w-full rounded-xl bg-white relative border-8 border-white">
                    <!-- Header -->
                    <section class="rounded-t-xl flex items-start justify-left p-4">
                        <!-- Icon -->
                        <SolarCameraSquareLinear class="mt-1 w-8 h-8 text-gray-800" />

                        <!-- Text -->
                        <div class="ml-4">
                            <h1 class="text-xl font-medium">{ scan.title }</h1>
                            <p class="text-xs text-gray-700">{ scan.description }</p>
                        </div>
                    </section>

                    <!-- Image itself -->
                    <section>
                        <StillImageFeed class="w-full rounded-xl" stillImage={scan.image} />
                    </section>
                </div>
            { /each }
        </div>
    { :else }
        <div class="absolute z-0">
            { #if $KeycardWizardStore.currentImage != null }
                <StillImageFeed stillImage={$KeycardWizardStore.currentImage} />
            { :else }
                <CameraFeed />
            { /if }
        </div>
    { /if }
</div>