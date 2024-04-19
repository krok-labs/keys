<script lang="ts">
    import { goto } from "$app/navigation";
    import { ApplicationConfiguration } from "$lib";
    import { onMount } from "svelte";

    onMount(() => {
        goto(`/app/${$ApplicationConfiguration!.role}/cards`);
    });
</script>