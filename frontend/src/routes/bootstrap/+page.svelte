<script lang="ts">
    import { ApplicationConfiguration, Button } from "$lib";
    import SolarUserLinear from '~icons/solar/user-linear';
    import SolarLockLinear from '~icons/solar/lock-linear';
    import { ApplicationRole } from "$lib/types";
    import { goto } from "$app/navigation";

    // chooseRole
    function chooseRole(role: ApplicationRole) {
        ApplicationConfiguration.bootstrap(role);
        goto(`/app/${role.toString()}`);
    };
</script>

<div class="w-full h-screen flex items-center justify-center bg-gray-100">
    <div class="w-1/3 rounded-md bg-white p-6">
        <!-- Buttons -->
        <div class="flex items-center justify-between gap-4">
            <!-- Admin -->
            <Button on:click={() => chooseRole(ApplicationRole.ADMIN)} icon={SolarLockLinear} text="Admin" class="w-1/2" />
            
            <!-- Guest -->
            <Button on:click={() => chooseRole(ApplicationRole.GUEST)} icon={SolarUserLinear} text="Guest" class="w-1/2" />
        </div>
    </div>
</div>