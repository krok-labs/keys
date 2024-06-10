<script lang="ts">
    import { getStore } from "$lib/helpers";
    import { KeycardWizardStore } from "$lib/modules";

    async function checkIfPropertiesSet() {
        const store = await getStore(KeycardWizardStore.subscribe);
        
        if (Object.values(store.form).filter((x) => x != null).length == 4) {
            // All values are set - user can proceed to next step
            KeycardWizardStore.setIsNextStateAvailable(true);
        } else {
            KeycardWizardStore.setIsNextStateAvailable(false);
        };
    };

    function handleInputEvent(property: "firstname" | "middlename" | "surname" | "cardNumber", value: string) {
        // Asking our KeycardWizardStore to save this property value
        KeycardWizardStore.setFormProperty(property, value == "" ? undefined : value);

        // Checking if every property is set
        checkIfPropertiesSet();
    };
</script>

<!-- Form -->
<div class="mt-10">
    <!-- Firstname, Surname, Middlename -->
    <div class="my-5">
        <p class="text-sm font-bold">Ім'я</p>
        <input on:input={(event) => {
            // @ts-ignore   
            handleInputEvent("firstname", event.target.value)
        }} class="mt-1.5 w-full rounded-xl py-2 px-4 bg-gray-100 border-2 border-gray-200 text-black" placeholder="Ім'я" type="text">
    </div>

    <div class="my-5">
        <p class="text-sm font-bold">Фамілія</p>
        <input on:input={(event) => {
            // @ts-ignore   
            handleInputEvent("surname", event.target.value)
        }} class="mt-1.5 w-full rounded-xl py-2 px-4 bg-gray-100 border-2 border-gray-200 text-black" placeholder="Фамілія" type="text">
    </div>

    <div class="my-5">
        <p class="text-sm font-bold">По-батькові</p>
        <input on:input={(event) => {
            // @ts-ignore   
            handleInputEvent("middlename", event.target.value)
        }} class="mt-1.5 w-full rounded-xl py-2 px-4 bg-gray-100 border-2 border-gray-200 text-black" placeholder="По-батькові" type="text">
    </div>

    <!-- Divider -->
    <div class="w-full my-10 h-1 rounded-full bg-gray-100"></div>

    <!-- Card Id -->
    <div class="my-5">
        <p class="text-sm font-bold">Номер виданої картки</p>
        <input on:input={(event) => {
            // @ts-ignore   
            handleInputEvent("cardNumber", event.target.value)
        }} class="mt-1.5 w-full rounded-xl py-2 px-4 bg-gray-100 border-2 border-gray-200 text-black" placeholder="1200" type="text">
    </div>                    
</div>