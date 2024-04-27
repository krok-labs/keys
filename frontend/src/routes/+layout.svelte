<script>
    import { onMount } from "svelte";
    import "../app.pcss";
    import { SynchronizationStore } from "$lib";

    onMount(() => {
        SynchronizationStore.initialize();
    })
</script>

<slot></slot>