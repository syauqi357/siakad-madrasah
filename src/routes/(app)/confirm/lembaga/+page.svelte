<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';

	// Date formatting
	const dtpFormat = new Date();
	let date = dtpFormat.getDate();
	let month = dtpFormat.toLocaleString('id-ID', { month: 'long' });
	let year = dtpFormat.getFullYear();

	// API variable
	const apiUrl = import.meta.env.VITE_API_URL;

	// Type definition
	type SchoolData = {
		name: string;
		npsn: string;
		nsm: string;
		kota: string;
		alamat: string;
		akreditasi: string;
		negara: string;
		logoUrl: string;
	};

	// State
	let schoolData: SchoolData | null = null;
	let loading = true;
	let error = false;

	onMount(async () => {
		try {
			const response = await fetch(`${apiUrl}/routes/api/schoolData`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const fetchedData = await response.json();

			schoolData = {
				name: fetchedData.name || '',
				kota: fetchedData.kota || '',
				npsn: fetchedData.npsn || '',
				alamat: fetchedData.alamat || '',
				nsm: fetchedData.nsm || '',
				akreditasi: fetchedData.akreditasi || '',
				negara: fetchedData.negara || 'Indonesia',
				logoUrl: fetchedData.logoUrl ? `${apiUrl}${fetchedData.logoUrl}` : ''
			};

			loading = false;
		} catch (err) {
			console.error('Failed to fetch school data:', err);
			error = true;
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Konfirmasi Data Lembaga</title>
</svelte:head>

<!-- Screen Layout -->
<div
	class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 p-4 md:p-8 print:min-h-0 print:bg-white print:p-0"
>
	<div class="mx-auto max-w-4xl">
		<!-- Header - Screen Only -->
		<div class="mb-6 flex items-center justify-between print:hidden">
			<button
				on:click={() => goto('/lembaga')}
				class="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50"
			>
				<span class="transition-transform group-hover:-translate-x-1"><ArrowLeft /></span>
				Kembali
			</button>

			<button
				on:click={() => window.print()}
				class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-md"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
					/>
				</svg>
				Cetak
			</button>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="flex flex-col items-center justify-center py-24 print:hidden">
				<div class="relative h-12 w-12">
					<div
						class="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500"
					></div>
				</div>
				<p class="mt-4 text-sm font-medium text-slate-500">Memuat data...</p>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center py-24 text-center print:hidden">
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
					<svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<p class="mb-2 text-lg font-semibold text-slate-800">Terjadi Kesalahan</p>
				<p class="text-sm text-slate-500">Gagal memuat data lembaga</p>
			</div>
		{:else if schoolData}
			<!-- Main Content Card -->
			<div
				class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none"
			>
				<!-- Card Header - Fancy on screen, formal on print -->
				<div
					class="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-8 print:bg-white print:py-6"
				>
					<!-- Decorative circles - screen only -->
					<div
						class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 print:hidden"
					></div>
					<div
						class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 print:hidden"
					></div>

					<div class="relative flex items-center gap-6">
						<!-- Logo -->
						<div
							class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 bg-white/20 backdrop-blur-sm print:h-20 print:w-20 print:rounded-lg print:border-slate-300 print:bg-white"
						>
							{#if schoolData.logoUrl}
								<img
									src={schoolData.logoUrl}
									alt="Logo Sekolah"
									class="h-full w-full object-contain p-2"
								/>
							{:else}
								<svg
									class="h-12 w-12 text-white/70 print:text-slate-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
							{/if}
						</div>

						<div class="flex-1">
							<h1
								class="text-2xl font-bold text-white md:text-3xl print:text-xl print:text-slate-800"
							>
								{schoolData.name}
							</h1>
							<div class="mt-2 flex flex-wrap items-center gap-3">
								{#if schoolData.akreditasi}
									<span
										class="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm print:bg-emerald-100 print:text-emerald-700"
									>
										Akreditasi {schoolData.akreditasi}
									</span>
								{/if}
								<span class="text-sm text-emerald-100 print:text-slate-500">
									{schoolData.kota}, {schoolData.negara}
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Date line - print formal style -->
				<div
					class="hidden border-b border-slate-200 px-8 py-3 text-right text-sm text-slate-600 print:block"
				>
					{schoolData.kota}, {date}
					{month}
					{year}
				</div>

				<!-- Document Title - Print Only -->
				<div class="hidden border-b border-slate-200 px-8 py-4 text-center print:block">
					<h2 class="text-lg font-bold tracking-wider text-slate-800 uppercase">
						Data Kelembagaan
					</h2>
				</div>

				<!-- Content -->
				<div class="p-8 print:p-6">
					<!-- Section Title - Screen only -->
					<h2 class="mb-6 flex items-center gap-3 text-lg font-bold text-slate-800 print:hidden">
						<span
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</span>
						Informasi Lembaga
					</h2>

					<!-- Data Grid -->
					<div class="grid gap-6 md:grid-cols-2 print:gap-4">
						<!-- Nama Sekolah -->
						<div class="md:col-span-2">
							<div
								class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 print:rounded-none print:border-0 print:border-b print:border-slate-200 print:bg-transparent print:p-2"
							>
								<p
									class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500"
								>
									Nama Sekolah/Madrasah
								</p>
								<p class="text-base font-semibold text-slate-800 print:text-sm">
									{schoolData.name}
								</p>
							</div>
						</div>

						<!-- NPSN -->
						<div>
							<div
								class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 print:rounded-none print:border-0 print:border-b print:border-slate-200 print:bg-transparent print:p-2"
							>
								<p
									class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500"
								>
									NPSN
								</p>
								<p class="font-mono text-base font-semibold text-slate-800 print:text-sm">
									{schoolData.npsn || '-'}
								</p>
							</div>
						</div>

						<!-- NSM -->
						<div>
							<div
								class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 print:rounded-none print:border-0 print:border-b print:border-slate-200 print:bg-transparent print:p-2"
							>
								<p
									class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500"
								>
									NSM
								</p>
								<p class="font-mono text-base font-semibold text-slate-800 print:text-sm">
									{schoolData.nsm || '-'}
								</p>
							</div>
						</div>

						<!-- Akreditasi -->
						<div>
							<div
								class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 print:rounded-none print:border-0 print:border-b print:border-slate-200 print:bg-transparent print:p-2"
							>
								<p
									class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500"
								>
									Akreditasi
								</p>
								<p class="text-base font-semibold text-slate-800 print:text-sm">
									{#if schoolData.akreditasi}
										<span
											class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-semibold text-emerald-700 print:bg-transparent print:p-0"
										>
											{schoolData.akreditasi}
										</span>
									{:else}
										-
									{/if}
								</p>
							</div>
						</div>

						<!-- Kota -->
						<div>
							<div
								class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 print:rounded-none print:border-0 print:border-b print:border-slate-200 print:bg-transparent print:p-2"
							>
								<p
									class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500"
								>
									Kota/Kabupaten
								</p>
								<p class="text-base font-semibold text-slate-800 print:text-sm">
									{schoolData.kota || '-'}
								</p>
							</div>
						</div>

						<!-- Alamat -->
						<div class="md:col-span-2">
							<div
								class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 print:rounded-none print:border-0 print:border-b print:border-slate-200 print:bg-transparent print:p-2"
							>
								<p
									class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500"
								>
									Alamat Lengkap
								</p>
								<p class="text-base font-semibold text-slate-800 print:text-sm">
									{schoolData.alamat || '-'}
								</p>
							</div>
						</div>

						<!-- Negara -->
						<div>
							<div
								class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 print:rounded-none print:border-0 print:border-b print:border-slate-200 print:bg-transparent print:p-2"
							>
								<p
									class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500"
								>
									Negara
								</p>
								<p class="text-base font-semibold text-slate-800 print:text-sm">
									{schoolData.negara || '-'}
								</p>
							</div>
						</div>
					</div>

					<!-- Summary Stats - Screen Only -->
					<div class="mt-8 grid grid-cols-3 gap-4 print:hidden">
						<div
							class="relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4"
						>
							<div class="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-emerald-500/10"></div>
							<p class="text-xs font-semibold tracking-wider text-emerald-600 uppercase">Status</p>
							<p class="mt-1 text-lg font-bold text-emerald-700">Aktif</p>
						</div>
						<div
							class="relative overflow-hidden rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-4"
						>
							<div class="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-sky-500/10"></div>
							<p class="text-xs font-semibold tracking-wider text-sky-600 uppercase">Jenjang</p>
							<p class="mt-1 text-lg font-bold text-sky-700">-</p>
						</div>
						<div
							class="relative overflow-hidden rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4"
						>
							<div class="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-amber-500/10"></div>
							<p class="text-xs font-semibold tracking-wider text-amber-600 uppercase">
								Akreditasi
							</p>
							<p class="mt-1 text-lg font-bold text-amber-700">{schoolData.akreditasi || '-'}</p>
						</div>
					</div>
				</div>

				<!-- Footer - Print Only -->
				<div class="hidden border-t border-slate-200 px-8 py-6 print:block">
					<div class="flex justify-end">
						<div class="text-center">
							<p class="text-sm text-slate-600">{schoolData.kota}, {date} {month} {year}</p>
							<p class="mt-1 text-sm font-semibold text-slate-800">Kepala Sekolah</p>
							<div class="mt-16 border-b border-slate-400"></div>
							<p class="mt-1 text-sm text-slate-600">NIP. ........................</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Screen Footer Info -->
			<div class="mt-6 text-center text-xs text-slate-400 print:hidden">
				Dicetak pada {date}
				{month}
				{year}
			</div>
		{/if}
	</div>
</div>
