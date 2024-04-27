<script>
    import { onMount } from "svelte";
    import { Circle } from "svelte-loading-spinners";
    import { goto } from "$app/navigation";

    // Checking client configuration
    onMount(async () => {
        goto("/bootstrap");
    });
</script>

<div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
    <Circle size={30} color={"#374151"} />
    
    <p class="mt-4 text-gray-700">Завантаження данних...</p>
</div>
