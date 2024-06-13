<script lang="ts">
    import CardsWizardComponent from "../../../_cards/CardsWizardComponent.svelte";
    import { page } from "$app/stores";

    // todo: check this
    let type = $page.params.type as "one-time" | "temporary";
</script>

<CardsWizardComponent side="guest" {type} />