<script lang="ts">
	import PhoneInput from '$lib/components/input/PhoneInput.svelte';

    // Props to bind data back to the parent
    export let fatherData = {
        name: '',
        nik: '',
        job: '',
        phone: ''
    };

    export let motherData = {
        name: '',
        nik: '',
        job: '',
        phone: ''
    };
</script>

<div class="space-y-8">
    <!-- Data Ayah -->
    <div class="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 class="mb-6 text-xl font-semibold text-slate-800 flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">A</span>
            Data Ayah Kandung
        </h2>

        <div class="grid gap-6 md:grid-cols-2">
            <!-- Nama Ayah -->
            <div class="relative w-full md:col-span-2">
                <input type="text" id="fatherName" bind:value={fatherData.name} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="fatherName" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Nama Lengkap Ayah</label>
            </div>

            <!-- NIK Ayah -->
            <div class="relative w-full">
                <input type="text" id="fatherNik" bind:value={fatherData.nik} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="fatherNik" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">NIK Ayah</label>
            </div>

            <!-- Pekerjaan Ayah -->
            <div class="relative w-full">
                <input type="text" id="fatherJob" bind:value={fatherData.job} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="fatherJob" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Pekerjaan Ayah</label>
            </div>

            <!-- Phone Number (Component) -->
            <div class="md:col-span-2">
                <PhoneInput bind:value={fatherData.phone} label="Nomor Telepon / WA Ayah" />
            </div>
        </div>
    </div>

    <!-- Data Ibu -->
    <div class="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 class="mb-6 text-xl font-semibold text-slate-800 flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-sm font-bold">I</span>
            Data Ibu Kandung
        </h2>

        <div class="grid gap-6 md:grid-cols-2">
            <!-- Nama Ibu -->
            <div class="relative w-full md:col-span-2">
                <input type="text" id="motherName" bind:value={motherData.name} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="motherName" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Nama Lengkap Ibu</label>
            </div>

            <!-- NIK Ibu -->
            <div class="relative w-full">
                <input type="text" id="motherNik" bind:value={motherData.nik} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="motherNik" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">NIK Ibu</label>
            </div>

            <!-- Pekerjaan Ibu -->
            <div class="relative w-full">
                <input type="text" id="motherJob" bind:value={motherData.job} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="motherJob" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Pekerjaan Ibu</label>
            </div>

            <!-- Phone Number (Component) -->
            <div class="md:col-span-2">
                <PhoneInput bind:value={motherData.phone} label="Nomor Telepon / WA Ibu" />
            </div>
        </div>
    </div>
</div>
