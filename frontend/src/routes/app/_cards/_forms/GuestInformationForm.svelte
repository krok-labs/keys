<script lang="ts">
    import { getStore } from "$lib/helpers";
    import { KeycardWizardStore } from "$lib/modules";
    import moment, { type Moment } from "moment";
    import { onMount } from "svelte";

    async function checkIfPropertiesSet() {
        const store = await getStore(KeycardWizardStore.subscribe);
        
        if (Object.values(store.form).filter((x) => x != null).length == inputsCount()) {
            // All values are set - user can proceed to next step
            KeycardWizardStore.setIsNextStateAvailable(true);
        } else {
            KeycardWizardStore.setIsNextStateAvailable(false);
        };
    };

    function handleInputEvent(property: "firstname" | "middlename" | "surname" | "cardNumber" | "expiresAt", value: any) {
        // Asking our KeycardWizardStore to save this property value
        KeycardWizardStore.setFormProperty(property, value == "" ? undefined : value);

        // Checking if every property is set
        checkIfPropertiesSet();
    };

    $: inputsCount = () => {
        let baseCount = 4;

        if (isExpiresAtSelectable) baseCount++;

        return baseCount;
    };

    let expiresAtDates: Array<{ label: string, date: Moment }> = [
        { label: "1 місяць", date: moment().add(1, 'month') },
        { label: "2 місяці", date: moment().add(2, 'month') },
        { label: "3 місяці", date: moment().add(3, 'month') },
        { label: "6 місяців", date: moment().add(6, 'month') },
        { label: "12 місяців", date: moment().add(12, 'month') }
    ];

    export let isExpiresAtSelectable = false;
</script>

<!-- Form -->
<div class="mt-10">
    <!-- Firstname, Surname, Middlename -->
    <div class="my-5 px-2">
        <p class="text-sm font-bold">Ім'я</p>
        <input on:input={(event) => {
            // @ts-ignore   
            handleInputEvent("firstname", event.target.value)
        }} class="mt-1.5 w-full rounded-xl py-2 px-4 bg-gray-100 border-2 border-gray-200 text-black" placeholder="Ім'я" type="text">
    </div>

    <div class="my-5 px-2">
        <p class="text-sm font-bold">Фамілія</p>
        <input on:input={(event) => {
            // @ts-ignore   
            handleInputEvent("surname", event.target.value)
        }} class="mt-1.5 w-full rounded-xl py-2 px-4 bg-gray-100 border-2 border-gray-200 text-black" placeholder="Фамілія" type="text">
    </div>

    <div class="my-5 px-2">
        <p class="text-sm font-bold">По-батькові</p>
        <input on:input={(event) => {
            // @ts-ignore   
            handleInputEvent("middlename", event.target.value)
        }} class="mt-1.5 w-full rounded-xl py-2 px-4 bg-gray-100 border-2 border-gray-200 text-black" placeholder="По-батькові" type="text">
    </div>

    <!-- Divider -->
    <div class="w-full my-10 h-1 rounded-full bg-gray-100"></div>

    <!-- Card Id -->
    <div class="my-5 px-2">
        <p class="text-sm font-bold">Номер виданої картки</p>
        <input on:input={(event) => {
            // @ts-ignore   
            handleInputEvent("cardNumber", event.target.value)
        }} class="mt-1.5 w-full rounded-xl py-2 px-4 bg-gray-100 border-2 border-gray-200 text-black" placeholder="1200" type="text">
    </div>
    
    { #if isExpiresAtSelectable }
        <p class="mt-5 mx-2 text-sm font-bold">Термін дії картки</p>

        <div class="flex flex-wrap">
            { #each expiresAtDates as entry }
                { @const isSelected = entry.date.isSame($KeycardWizardStore.form.expiresAt) }

                <button on:click={() => {
                    handleInputEvent("expiresAt", entry.date);
                }} class="w-1/3 p-2 relative">
                    <div class="w-full text-left px-4 py-2 h-full rounded-md bg-gray-100 border-4 { isSelected ? "border-blue-500" : "border-transparent" }">
                        <h1 class="text-md font-medium">{ entry.label }</h1>
                        <p class="text-sm text-gray-800">{ entry.date.format("YYYY-MM-DD") }</p>
                    </div>
                </button>
            { /each }
        </div>
    { /if }
</div>