<script lang="ts">
    import { SelectedKeyCard } from "./components";

    export let role: "all" | "selected" | "committed" = "all";
    export let side: "admin" | "guest" = "guest";
</script>

<!-- Selected Keys -->
{ #if role == "selected" }

<!-- Committed Keys -->
{ :else if role == "committed" }

<!-- All Keys -->
{ :else if role == "all" }

{ /if }