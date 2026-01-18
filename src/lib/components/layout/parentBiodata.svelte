<script lang="ts">
	import PhoneInput from '$lib/components/input/PhoneInput.svelte';

	// Props to bind data back to the parent
	export let fatherData = {
		name: '',
		nik: '',
		job: '', // occupation
		phone: '', // phoneNumber
		birthPlace: '',
		birthDate: '',
		birthYear: '',
		education: '',
		monthlyIncome: '',
		isAlive: '1' // Default to Alive (1)
	};

	export let motherData = {
		name: '',
		nik: '',
		job: '', // occupation
		phone: '', // phoneNumber
		birthPlace: '',
		birthDate: '',
		birthYear: '',
		education: '',
		monthlyIncome: '',
		isAlive: '1' // Default to Alive (1)
	};

    // Generate a list of years for the dropdown
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 70 }, (_, i) => currentYear - i - 15); // From 15 years ago to ~85 years ago
</script>

<div class="space-y-8">
	<!-- Data Ayah -->
	<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
			<span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">A</span>
			Data Ayah Kandung
		</h2>

		<div class="grid gap-6 md:grid-cols-2">
            <!-- Status Hidup -->
            <div class="relative w-full md:col-span-2">
                <select id="fatherIsAlive" bind:value={fatherData.isAlive} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300 appearance-none">
                    <option value="1">Masih Hidup</option>
                    <option value="0">Meninggal Dunia</option>
                </select>
                <label for="fatherIsAlive" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Status</label>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

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

            <!-- Tempat Lahir -->
            <div class="relative w-full">
                <input type="text" id="fatherBirthPlace" bind:value={fatherData.birthPlace} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="fatherBirthPlace" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Tempat Lahir</label>
            </div>

            <!-- Tanggal Lahir -->
            <div class="relative w-full">
                <input type="date" id="fatherBirthDate" bind:value={fatherData.birthDate} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="fatherBirthDate" class="absolute left-2.5 -top-2 z-10 cursor-text bg-white px-1 text-xs text-slate-400 transition-all duration-300 peer-focus:text-blue-500">Tanggal Lahir</label>
            </div>

            <!-- Tahun Lahir -->
            <div class="relative w-full">
                <select id="fatherBirthYear" bind:value={fatherData.birthYear} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300 appearance-none">
                    <option value="" disabled selected></option>
                    {#each years as year}
                        <option value={year}>{year}</option>
                    {/each}
                </select>
                <label for="fatherBirthYear" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Tahun Lahir</label>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            <!-- Pendidikan -->
            <div class="relative w-full">
                <select id="fatherEducation" bind:value={fatherData.education} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300 appearance-none">
                    <option value="" disabled selected></option>
                    <option value="SD">SD / Sederajat</option>
                    <option value="SMP">SMP / Sederajat</option>
                    <option value="SMA">SMA / Sederajat</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="Tidak Sekolah">Tidak Sekolah</option>
                </select>
                <label for="fatherEducation" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Pendidikan Terakhir</label>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

			<!-- Pekerjaan Ayah -->
			<div class="relative w-full">
				<input type="text" id="fatherJob" bind:value={fatherData.job} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
				<label for="fatherJob" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Pekerjaan Ayah</label>
			</div>

            <!-- Penghasilan Bulanan -->
            <div class="relative w-full">
                <select id="fatherIncome" bind:value={fatherData.monthlyIncome} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300 appearance-none">
                    <option value="" disabled selected></option>
                    <option value="< 500.000">Kurang dari Rp 500.000</option>
                    <option value="500.000 - 1.000.000">Rp 500.000 - Rp 1.000.000</option>
                    <option value="1.000.000 - 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                    <option value="2.000.000 - 5.000.000">Rp 2.000.000 - Rp 5.000.000</option>
                    <option value="> 5.000.000">Lebih dari Rp 5.000.000</option>
                </select>
                <label for="fatherIncome" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Penghasilan Bulanan</label>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

			<!-- Phone Number (Component) -->
			<div class="md:col-span-2">
				<PhoneInput bind:value={fatherData.phone} label="Nomor Telepon / WA Ayah" />
			</div>
		</div>
	</div>

	<!-- Data Ibu -->
	<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
			<span class="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">I</span>
			Data Ibu Kandung
		</h2>

		<div class="grid gap-6 md:grid-cols-2">
            <!-- Status Hidup -->
            <div class="relative w-full md:col-span-2">
                <select id="motherIsAlive" bind:value={motherData.isAlive} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300 appearance-none">
                    <option value="1">Masih Hidup</option>
                    <option value="0">Meninggal Dunia</option>
                </select>
                <label for="motherIsAlive" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Status</label>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

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

            <!-- Tempat Lahir -->
            <div class="relative w-full">
                <input type="text" id="motherBirthPlace" bind:value={motherData.birthPlace} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="motherBirthPlace" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Tempat Lahir</label>
            </div>

            <!-- Tanggal Lahir -->
            <div class="relative w-full">
                <input type="date" id="motherBirthDate" bind:value={motherData.birthDate} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
                <label for="motherBirthDate" class="absolute left-2.5 -top-2 z-10 cursor-text bg-white px-1 text-xs text-slate-400 transition-all duration-300 peer-focus:text-blue-500">Tanggal Lahir</label>
            </div>

            <!-- Tahun Lahir -->
            <div class="relative w-full">
                <select id="motherBirthYear" bind:value={motherData.birthYear} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300 appearance-none">
                    <option value="" disabled selected></option>
                    {#each years as year}
                        <option value={year}>{year}</option>
                    {/each}
                </select>
                <label for="motherBirthYear" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Tahun Lahir</label>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            <!-- Pendidikan -->
            <div class="relative w-full">
                <select id="motherEducation" bind:value={motherData.education} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300 appearance-none">
                    <option value="" disabled selected></option>
                    <option value="SD">SD / Sederajat</option>
                    <option value="SMP">SMP / Sederajat</option>
                    <option value="SMA">SMA / Sederajat</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="Tidak Sekolah">Tidak Sekolah</option>
                </select>
                <label for="motherEducation" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Pendidikan Terakhir</label>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

			<!-- Pekerjaan Ibu -->
			<div class="relative w-full">
				<input type="text" id="motherJob" bind:value={motherData.job} placeholder=" " class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" />
				<label for="motherJob" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Pekerjaan Ibu</label>
			</div>

            <!-- Penghasilan Bulanan -->
            <div class="relative w-full">
                <select id="motherIncome" bind:value={motherData.monthlyIncome} class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300 appearance-none">
                    <option value="" disabled selected></option>
                    <option value="< 500.000">Kurang dari Rp 500.000</option>
                    <option value="500.000 - 1.000.000">Rp 500.000 - Rp 1.000.000</option>
                    <option value="1.000.000 - 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                    <option value="2.000.000 - 5.000.000">Rp 2.000.000 - Rp 5.000.000</option>
                    <option value="> 5.000.000">Lebih dari Rp 5.000.000</option>
                </select>
                <label for="motherIncome" class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400">Penghasilan Bulanan</label>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

			<!-- Phone Number (Component) -->
			<div class="md:col-span-2">
				<PhoneInput bind:value={motherData.phone} label="Nomor Telepon / WA Ibu" />
			</div>
		</div>
	</div>
</div>
