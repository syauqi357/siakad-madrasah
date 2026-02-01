<script lang="ts">
	import { API_FETCH } from '$lib/api';
	const apiUrl = import.meta.env.VITE_API_URL;

	// Facility configuration - labels and icons for each type
	const facilityConfig: Record<string, { label: string; icon: string }> = {
		aset: { label: 'Aset Sekolah', icon: '📦' },
		asrama: { label: 'Asrama', icon: '🏠' },
		canteen: { label: 'Kantin', icon: '🍽️' },
		certification: { label: 'Sertifikasi', icon: '📜' },
		gedung: { label: 'Gedung', icon: '🏢' },
		kamar_mandi: { label: 'Kamar Mandi', icon: '🚿' },
		kantor: { label: 'Kantor', icon: '🏛️' },
		kelas: { label: 'Ruang Kelas', icon: '📚' },
		lapangan: { label: 'Lapangan', icon: '⚽' },
		masjid: { label: 'Masjid', icon: '🕌' },
		parking_lot: { label: 'Tempat Parkir', icon: '🅿️' }
	};

	const labConfig: Record<string, { label: string; icon: string }> = {
		lab_Ipa: { label: 'Laboratorium IPA', icon: '🔬' },
		lab_komputer: { label: 'Laboratorium Komputer', icon: '💻' },
		lab_multimedia: { label: 'Laboratorium Multimedia', icon: '🎬' }
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
			<div class="flex flex-col items-center justify-center rounded-lg bg-slate-50 py-16">
				<div class="mb-4 text-6xl opacity-50">🏫</div>
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
							<h2 class="flex items-center gap-2 text-lg font-semibold text-slate-800">
								<span>{config.icon}</span>
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
							<h2 class="flex items-center gap-2 text-lg font-semibold text-slate-800">
								<span>{config.icon}</span>
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
		{/if}
	{:catch error}
		<!-- Error State -->
		<div class="flex flex-col items-center justify-center rounded-lg bg-red-50 py-12">
			<div class="mb-4 text-5xl">⚠️</div>
			<h3 class="text-lg font-medium text-red-700">Gagal Memuat Fasilitas</h3>
			<p class="mt-2 text-sm text-red-600">
				{error.message || 'Terjadi kesalahan saat memuat data'}
			</p>
			<button
				class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
				on:click={() => window.location.reload()}
			>
				Coba Lagi
			</button>
		</div>
	{/await}
</section>
