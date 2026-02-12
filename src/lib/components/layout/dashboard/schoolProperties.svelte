<script lang="ts">
	import { API_FETCH } from '$lib/api';
	const apiUrl = import.meta.env.VITE_API_URL;

	// Facility configuration - labels and icons for each type
	const facilityConfig: Record<string, { label: string }> = {
		aset: { label: 'Aset Sekolah' },
		asrama: { label: 'Asrama' },
		canteen: { label: 'Kantin' },
		certification: { label: 'Sertifikasi' },
		gedung: { label: 'Gedung' },
		kamar_mandi: { label: 'Kamar Mandi' },
		kantor: { label: 'Kantor' },
		kelas: { label: 'Ruang Kelas' },
		lapangan: { label: 'Lapangan' },
		masjid: { label: 'Masjid' },
		parking_lot: { label: 'Tempat Parkir' }
	};

	const labConfig: Record<string, { label: string }> = {
		lab_Ipa: { label: 'Laboratorium IPA' },
		lab_komputer: { label: 'Laboratorium Komputer' },
		lab_multimedia: { label: 'Laboratorium Multimedia' }
	};

	const MAX_IMAGES = 3;

	interface FacilitiesData {
		aset: string[];
		asrama: string[];
		canteen: string[];
		certification: string[];
		gedung: string[];
		kamar_mandi: string[];
		kantor: string[];
		kelas: string[];
		lab: {
			lab_Ipa: string[];
			lab_komputer: string[];
			lab_multimedia: string[];
		};
		lapangan: string[];
		masjid: string[];
		parking_lot: string[];
	}

	async function fetchFacilities(): Promise<FacilitiesData> {
		try {
			const response = await API_FETCH('/routes/api/schoolData');

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const fetchedData = await response.json();

			return {
				aset: fetchedData.aset || [],
				asrama: fetchedData.asrama || [],
				canteen: fetchedData.canteen || [],
				certification: fetchedData.certification || [],
				gedung: fetchedData.gedung || [],
				kamar_mandi: fetchedData.kamar_mandi || [],
				kantor: fetchedData.kantor || [],
				kelas: fetchedData.kelas || [],
				lab: {
					lab_Ipa: fetchedData.lab?.lab_Ipa || [],
					lab_komputer: fetchedData.lab?.lab_komputer || [],
					lab_multimedia: fetchedData.lab?.lab_multimedia || []
				},
				lapangan: fetchedData.lapangan || [],
				masjid: fetchedData.masjid || [],
				parking_lot: fetchedData.parking_lot || []
			};
		} catch (error) {
			console.error('Failed to fetch facilities:', error);
			throw error;
		}
	}

	// Helper to check if facilities have any images
	function hasAnyImages(facilities: FacilitiesData): boolean {
		const mainFacilities = Object.entries(facilities)
			.filter(([key]) => key !== 'lab')
			.some(([, images]) => Array.isArray(images) && images.length > 0);

		const labFacilities = Object.values(facilities.lab).some(
			(images) => Array.isArray(images) && images.length > 0
		);

		return mainFacilities || labFacilities;
	}

	const facilitiesPromise = fetchFacilities();
</script>

<section class="space-y-6">
	{#await facilitiesPromise}
		<!-- Loading State -->
		<div class="flex flex-col items-center justify-center py-12">
			<div
				class="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500"
			></div>
			<p class="mt-4 text-sm text-slate-500">Memuat data fasilitas...</p>
		</div>
	{:then facilities}
		{#if !hasAnyImages(facilities)}
			<!-- Empty State - No facilities at all -->
			<div
				class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-16"
			>
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
					<!-- svg icon placeholder -->
				</div>
				<h3 class="text-lg font-medium text-slate-700">Belum Ada Foto Fasilitas</h3>
				<p class="mt-2 max-w-md text-center text-sm text-slate-500">
					Foto fasilitas sekolah belum tersedia. Silakan unggah foto melalui halaman pengaturan
					sekolah.
				</p>
				<p class="mt-1 text-xs text-slate-400">Maksimal {MAX_IMAGES} foto per kategori</p>
			</div>
		{:else}
			<!-- Main Facilities -->
			{#each Object.entries(facilityConfig) as [key, config]}
				{@const images = facilities[key as keyof Omit<FacilitiesData, 'lab'>]}
				{#if Array.isArray(images) && images.length > 0}
					<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
						<div class="mb-3 flex items-center justify-between">
							<h2 class="text-lg font-semibold text-slate-800">
								{config.label}
							</h2>
							<span class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
								{images.length}/{MAX_IMAGES} foto
							</span>
						</div>
						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{#each images as image, index}
								<div class="group relative overflow-hidden rounded-lg">
									<img
										src="{apiUrl}{image}"
										alt="{config.label} {index + 1}"
										class="h-48 w-full transform-gpu object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
										loading="lazy"
									/>
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
									></div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/each}

			<!-- Lab Facilities -->
			{#each Object.entries(labConfig) as [key, config]}
				{@const images = facilities.lab[key as keyof FacilitiesData['lab']]}
				{#if Array.isArray(images) && images.length > 0}
					<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
						<div class="mb-3 flex items-center justify-between">
							<h2 class="text-lg font-semibold text-slate-800">
								{config.label}
							</h2>
							<span class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
								{images.length}/{MAX_IMAGES} foto
							</span>
						</div>
						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{#each images as image, index}
								<div class="group relative overflow-hidden rounded-lg">
									<img
										src="{apiUrl}{image}"
										alt="{config.label} {index + 1}"
										class="h-48 w-full transform-gpu object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
										loading="lazy"
									/>
									<div
										class="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
									></div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	{:catch error}
		<!-- Error State -->
		<div
			class="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 py-16"
		>
			<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
				<!-- svg caution icon placeholder -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#FFD41D"
					><path
						d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"
					/></svg
				>
			</div>
			<h3 class="text-lg font-semibold text-slate-800">Gagal Memuat Fasilitas</h3>
			<p class="mt-2 max-w-sm text-center text-sm text-slate-500">
				{error.message || 'Terjadi kesalahan saat memuat data. Periksa koneksi Anda dan coba lagi.'}
			</p>
			<button
				class="mt-5 rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-700"
				on:click={() => window.location.reload()}
			>
				Coba Lagi
			</button>
		</div>
	{/await}
</section>
