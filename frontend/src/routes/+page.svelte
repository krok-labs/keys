<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    // Checking client configuration
    onMount(async () => {
        goto("/bootstrap");
    });
</script>