<script>
    import "../app.pcss";
    
    import { onMount } from "svelte";
    import { SynchronizationStore } from "$lib/modules";

    onMount(() => {
        SynchronizationStore.initialize();
    })
</script>

<slot></slot>