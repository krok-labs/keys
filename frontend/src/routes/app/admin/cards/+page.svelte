<script>
    import { goto } from "$app/navigation";
    import { ApplicationStateStore } from "$lib/modules";
    import { onMount } from "svelte";

    onMount(() => {
        ApplicationStateStore.changeApplication('cards/one-time');
    });
</script>