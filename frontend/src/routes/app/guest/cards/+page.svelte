<script lang="ts">
    import SolarScreenShareLinear from '~icons/solar/screen-share-linear';
    import SolarTrashBin2Linear from '~icons/solar/trash-bin-2-linear';
    import { Button } from '$lib';
</script>

<div class="w-2/5 p-4">
    <div class="bg-white rounded-xl py-4 px-6 flex items-start">
        <!-- Header -->
        <div class="w-1/2 pr-8">
        <!-- Header -->
        <header class="w-full flex items-center mb-4">
            <!-- Badge -->
            <span class="rounded-full px-3 py-1 bg-green-500 text-white text-xs">
            Є доступ
            </span>
        </header>

        <!-- Text -->
        <p class="text-sm text-gray-800">Актова зала</p>
        <h1 class="font-bold text-2xl">Ауд. 321</h1>

        <!-- Remove button -->
        <Button icon={SolarTrashBin2Linear} text="Видалити ключ" class="mt-6 w-full" />
        </div>

        <!-- Calendar -->
        <div class="w-1/2">
        <div>
            <p class="text-xs text-gray-700">Найближчі події</p>

            <!-- Current event -->
            <div class="w-full rounded-xl bg-green-500 px-4 py-2 my-2">
            <p class="text-xs text-gray-50">11:00 - 13:00</p>
            <h1 class="text-md font-medium text-white">Виступ K-DANCE "Готель КРОК"</h1>                
            </div>

            <!-- Next events -->
            <div class="w-full rounded-xl bg-gray-100 px-4 py-2 my-2">
            <p class="text-xs text-gray-700">13:00 - 14:00</p>
            <h1 class="text-md">Зустріч з героем України...</h1>
            </div>
        </div>
        </div>
    </div>
    </div>

    { #each [
    {
        isAvailable: true,
        text: "Ауд. 307"
    },
    {
        isAvailable: false,
        text: "Ауд. 002"
    },
    {
        isAvailable: false,
        text: "Мульт. 120"
    }
    ] as key }
    <div class="w-1/5 p-4">
        <div class="bg-white rounded-xl py-4 px-6">
        <!-- Header -->
        <header class="w-full flex items-center mb-4">
            <!-- Badge -->
            <span class="rounded-full px-3 py-1 { key.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white" } text-xs">
            { key.isAvailable ? "Є доступ" : "Немає доступу" }
            </span>
        </header>

        <!-- Text -->
        <p class="text-sm text-gray-800">Lorem ipsum 2</p>
        <h1 class="font-bold text-2xl">{ key.text }</h1>

        <!-- Remove button -->
        <Button icon={SolarTrashBin2Linear} text="Видалити ключ" class="mt-6 w-full" />
        </div>
    </div>
    { /each }

    <div class="w-1/5 p-4">
    <div class="bg-white rounded-xl">
        <!-- Header -->
        <header class="w-full rounded-t-xl px-6 py-3 bg-orange-400 flex items-center justify-between">            
        <p class="text-white">Поділитись ключем</p>

        <!-- Badge -->
        <span class="rounded-full px-3 py-1 bg-white text-black text-xs">
            Сервіс
        </span>
        </header>

        <!-- Content -->
        <div class="py-4 px-6 pb-6">
        <!-- Text -->
        <p class="text-black text-lg">Хочете поділитись ключем з іншою людиною? Ви можете налаштувати ім'я людини, дату взяття ключа та призначення.</p>
        
        <!-- Button -->
        <Button icon={SolarScreenShareLinear} text="Поділитись ключем" class="w-full mt-6" />
        </div>
    </div>
    </div>