<script>
    import { onMount } from "svelte";
    import { Circle } from "svelte-loading-spinners";
    import { goto } from "$app/navigation";
    import { ApplicationConfiguration } from "$lib";
    import { ApplicationRole } from "$lib/types";

    // Checking client configuration
    onMount(async () => {
        await ApplicationConfiguration.fetchFromLocalStorage();

        if ($ApplicationConfiguration == null) {
            goto("/bootstrap");
        } else {
            goto(`/app/${$ApplicationConfiguration.role.toString()}`);
        }
    });
</script>

<div class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
    <Circle size={30} color={"#374151"} />
    
    <p class="mt-4 text-gray-700">Завантаження данних...</p>
</div>
