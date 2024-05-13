<script lang="ts">
    import { goto } from "$app/navigation";
    import { getStore } from "$lib/helpers";
    import { ApplicationConfigurationStore } from "$lib/modules";
    import { onMount } from "svelte";

    onMount(async () => {
        // Getting current application side
        const configuration = (await getStore(ApplicationConfigurationStore.subscribe))!;
        goto(`/app/${configuration.side}/dashboard`);
    });
</script>