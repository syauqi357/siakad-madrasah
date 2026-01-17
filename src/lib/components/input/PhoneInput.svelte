<script>
	import { countryCodes } from '$lib/data/countryCodes.js';

	// Props
	export let value = '';
    export let defaultCode = '+62';
    export let label = 'Phone Number'; // Allow custom label

	// Internal state
	let selectedCode = defaultCode;
	let phoneNumber = '';

    function updateValue() {
        value = `${selectedCode}${phoneNumber}`;
    }

    let initialized = false;
    $: if (value && !initialized) {
        const found = countryCodes.find(c => value.startsWith(c.dial_code));
        if (found) {
            selectedCode = found.dial_code;
            phoneNumber = value.replace(found.dial_code, '');
            initialized = true;
        }
    }
</script>

<div class="relative w-full flex">
    <!-- Country Code Select -->
    <div class="relative">
        <select
            bind:value={selectedCode}
            on:change={updateValue}
            class="h-full rounded-l-md border border-r-0 border-slate-200 bg-slate-50 py-3 pl-3 pr-8 text-sm text-slate-700 focus:border-blue-500 focus:ring-0 focus:outline-none appearance-none"
        >
            {#each countryCodes as country}
                <option value={country.dial_code}>
                    {country.code} ({country.dial_code})
                </option>
            {/each}
        </select>
        <!-- Arrow Icon -->
<!--        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">-->
<!--            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>-->
<!--        </div>-->
    </div>

    <!-- Phone Number Input -->
    <div class="relative w-full">
        <input
            type="tel"
            id="phoneNumberInput"
            bind:value={phoneNumber}
            on:input={updateValue}
            placeholder=" "
            class="peer w-full rounded-r-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300"
        />
        <label
            for="phoneNumberInput"
            class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
            peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
        >
            {label}
        </label>
    </div>
</div>
