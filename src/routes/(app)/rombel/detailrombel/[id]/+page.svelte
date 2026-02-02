<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';

	// --- Interfaces ---
	interface Student {
		id: number;
		name: string;
		nisn: string;
		gender: string;
		status: 'ACTIVE' | 'MUTASI' | 'GRADUATE';
		isActive: boolean;
	}

	interface RombelDetail {
		id: number;
		code: string;
		namaRombel: string;
		tingkat: string;
		tingkatId: number;
		waliKelas: string | null;
		waliKelasId: number | null;
		ruangan: string | null;
		kapasitas: number;
		kurikulum: string;
		totalSiswa: number;
		students: Student[];
	}

	// --- State ---
	let rombelData: RombelDetail | null = null;
	let isLoading = true;
	let error: string | null = null;

	// Filter state - Default to ACTIVE (exclude MUTASI from main view)
	let statusFilter: 'ALL' | 'ACTIVE' | 'MUTASI' | 'GRADUATE' = 'ACTIVE';
	let searchQuery = '';

	// Get rombel ID from URL params
	$: rombelId = $page.params.id;

	// --- Functions ---
	async function fetchRombelDetail() {
		isLoading = true;
		error = null;

		try {
			const response = await API_FETCH(`/routes/api/rombel/${rombelId}`);

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.message || 'Failed to fetch rombel detail');
			}

			const result = await response.json();
			if (result.success) {
				rombelData = result.data;
			} else {
				throw new Error(result.message || 'Invalid data');
			}
		} catch (err) {
			console.error('Error fetching rombel detail:', err);
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	function backToMain() {
		goto('/rombel');
	}

	// --- Reactive: Filtered Students ---
	$: filteredStudents =
		rombelData?.students.filter((student) => {
			const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;
			const matchesSearch =
				searchQuery === '' ||
				student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				student.nisn.includes(searchQuery);
			return matchesStatus && matchesSearch;
		}) ?? [];

	// --- Counts by status ---
	$: activeCount = rombelData?.students.filter((s) => s.status === 'ACTIVE').length ?? 0;
	$: mutasiCount = rombelData?.students.filter((s) => s.status === 'MUTASI').length ?? 0;
	$: graduateCount = rombelData?.students.filter((s) => s.status === 'GRADUATE').length ?? 0;

	onMount(() => {
		fetchRombelDetail();
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
	<!-- Back Button -->
	<button
		on:click={backToMain}
		class="group mb-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow"
	>
		<span class="transition-transform group-hover:-translate-x-1"><ArrowLeft /></span>
		Kembali
	</button>

	{#if isLoading}
		<!-- Loading State -->
		<div class="flex flex-col items-center justify-center py-24">
			<div class="relative h-12 w-12">
				<div
					class="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500"
				></div>
			</div>
			<span class="mt-4 text-sm font-medium text-slate-500">Memuat data...</span>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="flex flex-col items-center justify-center py-24 text-center">
			<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
				<svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>
			<p class="mb-2 text-lg font-semibold text-slate-800">Terjadi Kesalahan</p>
			<p class="mb-6 text-sm text-slate-500">{error}</p>
			<button
				on:click={fetchRombelDetail}
				class="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg"
			>
				Coba Lagi
			</button>
		</div>
	{:else if rombelData}
		<!-- Rombel Header Card -->
		<div class="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<!-- Header Banner -->
			<div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 class="text-2xl font-bold text-white">{rombelData.namaRombel}</h1>
						<p class="mt-1 text-sm text-blue-100">Kode: {rombelData.code}</p>
					</div>
					<div class="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
						<div class="text-right">
							<span class="block text-xs font-medium tracking-wide text-blue-100 uppercase"
								>Kapasitas</span
							>
							<p class="text-2xl font-bold text-white">
								{rombelData.totalSiswa}<span class="text-lg text-blue-200"
									>/{rombelData.kapasitas}</span
								>
							</p>
						</div>
						<div class="h-10 w-10 rounded-full bg-white/20 p-1">
							<svg
								class="h-full w-full text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Info Grid -->
			<div class="grid grid-cols-2 gap-px bg-slate-100 md:grid-cols-4">
				<div class="bg-white p-4">
					<span class="text-xs font-medium tracking-wide text-slate-400 uppercase"
						>Tingkat Kelas</span
					>
					<p class="mt-1 text-lg font-semibold text-slate-800">{rombelData.tingkat || '-'}</p>
				</div>
				<div class="bg-white p-4">
					<span class="text-xs font-medium tracking-wide text-slate-400 uppercase">Wali Kelas</span>
					<p class="mt-1 text-lg font-semibold text-slate-800">{rombelData.waliKelas || '-'}</p>
				</div>
				<div class="bg-white p-4">
					<span class="text-xs font-medium tracking-wide text-slate-400 uppercase">Ruangan</span>
					<p class="mt-1 text-lg font-semibold text-slate-800">{rombelData.ruangan || '-'}</p>
				</div>
				<div class="bg-white p-4">
					<span class="text-xs font-medium tracking-wide text-slate-400 uppercase">Kurikulum</span>
					<p class="mt-1 text-lg font-semibold text-slate-800">{rombelData.kurikulum || '-'}</p>
				</div>
			</div>
		</div>

		<!-- Status Summary Cards -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<button
				on:click={() => (statusFilter = statusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
				class="group relative overflow-hidden rounded-xl border-2 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md {statusFilter ===
				'ACTIVE'
					? 'border-emerald-500 ring-4 ring-emerald-500/10'
					: 'border-transparent'}"
			>
				<div
					class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-500/10 transition-transform group-hover:scale-110"
				></div>
				<div class="relative">
					<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
						<svg
							class="h-5 w-5 text-emerald-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<span class="block text-xs font-semibold tracking-wide text-slate-400 uppercase"
						>Siswa Aktif</span
					>
					<span class="mt-1 block text-3xl font-bold text-slate-800">{activeCount}</span>
				</div>
			</button>

			<button
				on:click={() => (statusFilter = statusFilter === 'MUTASI' ? 'ALL' : 'MUTASI')}
				class="group relative overflow-hidden rounded-xl border-2 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md {statusFilter ===
				'MUTASI'
					? 'border-amber-500 ring-4 ring-amber-500/10'
					: 'border-transparent'}"
			>
				<div
					class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-amber-500/10 transition-transform group-hover:scale-110"
				></div>
				<div class="relative">
					<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
						<svg
							class="h-5 w-5 text-amber-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
					</div>
					<span class="block text-xs font-semibold tracking-wide text-slate-400 uppercase"
						>Mutasi</span
					>
					<span class="mt-1 block text-3xl font-bold text-slate-800">{mutasiCount}</span>
				</div>
			</button>

			<button
				on:click={() => (statusFilter = statusFilter === 'GRADUATE' ? 'ALL' : 'GRADUATE')}
				class="group relative overflow-hidden rounded-xl border-2 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md {statusFilter ===
				'GRADUATE'
					? 'border-blue-500 ring-4 ring-blue-500/10'
					: 'border-transparent'}"
			>
				<div
					class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-500/10 transition-transform group-hover:scale-110"
				></div>
				<div class="relative">
					<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
						<svg
							class="h-5 w-5 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
							/>
						</svg>
					</div>
					<span class="block text-xs font-semibold tracking-wide text-slate-400 uppercase"
						>Lulus</span
					>
					<span class="mt-1 block text-3xl font-bold text-slate-800">{graduateCount}</span>
				</div>
			</button>
		</div>

		<!-- Search and Filter Bar -->
		<div
			class="mb-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
		>
			<div class="relative flex-1 md:max-w-sm">
				<svg
					class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="text"
					placeholder="Cari nama atau NISN..."
					bind:value={searchQuery}
					class="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
				/>
			</div>

			<div class="flex items-center gap-3">
				<label for="statusFilter" class="text-sm font-medium text-slate-600">Filter:</label>
				<select
					id="statusFilter"
					bind:value={statusFilter}
					class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
				>
					<option value="ACTIVE">Aktif</option>
					<option value="GRADUATE">Lulus</option>
					<option value="MUTASI">Mutasi</option>
					<option value="ALL">Semua Status</option>
				</select>
			</div>
		</div>

		<!-- Students Table -->
		<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-slate-100 bg-slate-50">
							<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
								>No</th
							>
							<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
								>Nama Siswa</th
							>
							<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
								>NISN</th
							>
							<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
								>Jenis Kelamin</th
							>
							<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
								>Status</th
							>
							<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
								>Aksi</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#if filteredStudents.length === 0}
							<tr>
								<td colspan="6" class="px-5 py-16 text-center">
									<div class="flex flex-col items-center">
										<div
											class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"
										>
											<svg
												class="h-6 w-6 text-slate-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
												/>
											</svg>
										</div>
										<p class="text-sm font-medium text-slate-600">
											{#if searchQuery || statusFilter !== 'ALL'}
												Tidak ada siswa yang sesuai filter
											{:else}
												Belum ada siswa di rombel ini
											{/if}
										</p>
										<p class="mt-1 text-xs text-slate-400">
											Coba ubah filter atau kata kunci pencarian
										</p>
									</div>
								</td>
							</tr>
						{:else}
							{#each filteredStudents as student, i (student.id)}
								<tr class="transition-colors hover:bg-slate-50">
									<td class="px-5 py-4 text-slate-500">{i + 1}</td>
									<td class="px-5 py-4">
										<span class="font-semibold text-slate-800 capitalize">{student.name}</span>
									</td>
									<td class="px-5 py-4">
										<span class="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600"
											>{student.nisn}</span
										>
									</td>
									<td class="px-5 py-4 text-slate-600 capitalize">{student.gender || '-'}</td>
									<td class="px-5 py-4">
										{#if student.status === 'ACTIVE'}
											<span
												class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
												Aktif
											</span>
										{:else if student.status === 'MUTASI'}
											<span
												class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
												Mutasi
											</span>
										{:else}
											<span
												class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
												Lulus
											</span>
										{/if}
									</td>
									<td class="px-5 py-4">
										{#if student.status === 'ACTIVE'}
											<button
												class="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow"
											>
												Ubah Status
											</button>
										{:else}
											<span class="text-xs text-slate-300">—</span>
										{/if}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Footer info -->
		<div class="mt-4 flex items-center justify-between rounded-lg bg-white/50 px-4 py-3 text-sm">
			<span class="text-slate-500">
				Menampilkan <span class="font-semibold text-slate-700">{filteredStudents.length}</span> dari
				<span class="font-semibold text-slate-700">{rombelData.students.length}</span> siswa
			</span>
			{#if statusFilter !== 'ALL' || searchQuery}
				<button
					on:click={() => {
						statusFilter = 'ALL';
						searchQuery = '';
					}}
					class="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
				>
					Reset Filter
				</button>
			{/if}
		</div>
	{/if}
</div>
