<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';
	import { fade, fly } from 'svelte/transition';

	// --- Interfaces ---
	interface UnassignedStudent {
		id: number;
		name: string;
		nisn: string;
	}

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

	// --- Add Student Slide-over ---
	let showAddPanel = false;
	let unassignedStudents: UnassignedStudent[] = [];
	let selectedNewStudents: number[] = [];
	let addSearchQuery = '';
	let loadingUnassigned = false;
	let isSaving = false;

	// Modal alert state
	let showAlert = false;
	let alertType: 'success' | 'error' | 'warning' | 'info' = 'success';
	let alertMessage = '';

	$: availableSlots = (rombelData?.kapasitas ?? 0) - activeCount;
	$: isSlotsFull = selectedNewStudents.length >= availableSlots;

	$: filteredUnassigned = unassignedStudents.filter((s) => {
		if (!addSearchQuery) return true;
		const q = addSearchQuery.toLowerCase();
		return s.name.toLowerCase().includes(q) || s.nisn.includes(addSearchQuery);
	});

	$: allUnassignedSelected =
		filteredUnassigned.length > 0 &&
		filteredUnassigned.every((s) => selectedNewStudents.includes(s.id));

	async function openAddPanel() {
		showAddPanel = true;
		loadingUnassigned = true;
		selectedNewStudents = [];
		addSearchQuery = '';

		try {
			const response = await API_FETCH('/routes/api/studentDataSet/lite');
			if (response.ok) {
				const data = await response.json();
				unassignedStudents = data.data || data;
			}
		} catch (err) {
			console.error('Error fetching unassigned students:', err);
		} finally {
			loadingUnassigned = false;
		}
	}

	function closeAddPanel() {
		showAddPanel = false;
		selectedNewStudents = [];
		addSearchQuery = '';
	}

	function toggleNewStudent(id: number) {
		if (selectedNewStudents.includes(id)) {
			selectedNewStudents = selectedNewStudents.filter((s) => s !== id);
		} else if (selectedNewStudents.length < availableSlots) {
			selectedNewStudents = [...selectedNewStudents, id];
		}
	}

	function toggleAllUnassigned() {
		if (allUnassignedSelected) {
			selectedNewStudents = selectedNewStudents.filter(
				(id) => !filteredUnassigned.some((s) => s.id === id)
			);
		} else {
			const toAdd = filteredUnassigned
				.filter((s) => !selectedNewStudents.includes(s.id))
				.slice(0, availableSlots - selectedNewStudents.length)
				.map((s) => s.id);
			selectedNewStudents = [...selectedNewStudents, ...toAdd];
		}
	}

	async function saveNewStudents() {
		if (selectedNewStudents.length === 0) return;

		isSaving = true;
		try {
			const response = await API_FETCH(`/routes/api/rombel/${rombelId}/students`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ studentIds: selectedNewStudents })
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal menambahkan siswa');
			}

			closeAddPanel();
			await fetchRombelDetail();
			alertType = 'success';
			alertMessage = result.message;
			showAlert = true;
		} catch (err) {
			alertType = 'error';
			alertMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
			showAlert = true;
		} finally {
			isSaving = false;
		}
	}

	onMount(() => {
		fetchRombelDetail();
	});
</script>

<div class="mx-auto w-full max-w-full space-y-6 p-6">
	<!-- Top Nav -->
	<div class="flex items-center justify-between">
		<button
			on:click={backToMain}
			class="group flex items-center gap-2 rounded-full border border-blue-200 px-5 py-1.5 text-sm font-medium text-blue-600 transition-all hover:border-blue-300 hover:bg-blue-50"
		>
			<span class="transition-transform group-hover:-translate-x-1.5"><ArrowLeft /></span>
			Kembali
		</button>

		{#if rombelData}
			<button
				on:click={openAddPanel}
				class="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Tambah Siswa
			</button>
		{/if}
	</div>

	{#if isLoading}
		<div class="flex flex-col items-center justify-center py-24">
			<div
				class="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600"
			></div>
			<span class="mt-4 text-sm text-slate-400">Memuat data...</span>
		</div>
	{:else if error}
		<div class="flex flex-col items-center justify-center py-24 text-center">
			<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
				<svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<p class="mb-1 text-sm font-medium text-slate-700">{error}</p>
			<button
				on:click={fetchRombelDetail}
				class="mt-4 rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
			>
				Coba Lagi
			</button>
		</div>
	{:else if rombelData}
		{@const capacityPercent =
			rombelData.kapasitas > 0 ? Math.round((activeCount / rombelData.kapasitas) * 100) : 0}

		<!-- Page Header -->
		<div class="border-b border-slate-100 pb-5">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<div class="flex items-center gap-3">
						<h1 class="text-2xl font-bold text-slate-800">{rombelData.namaRombel}</h1>
						<span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500"
							>{rombelData.code}</span
						>
					</div>
					<p class="mt-1 text-sm text-slate-400">
						Kelas {rombelData.tingkat || '-'}
						{#if rombelData.waliKelas}
							<span class="mx-1.5 text-slate-300">|</span>
							Wali Kelas: <span class="text-slate-600">{rombelData.waliKelas}</span>
						{/if}
					</p>
				</div>
			</div>
		</div>

		<!-- Stats Row -->
		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
			<!-- Capacity Card -->
			<div class="col-span-2 rounded-xl border border-slate-200 bg-white p-5 lg:col-span-1">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold tracking-wide text-slate-400 uppercase">Kapasitas</span
					>
					<span
						class="text-xs font-bold {capacityPercent >= 90
							? 'text-red-500'
							: capacityPercent >= 70
								? 'text-amber-500'
								: 'text-emerald-600'}">{capacityPercent}%</span
					>
				</div>
				<p class="mt-2 text-3xl font-bold text-slate-800">
					{activeCount}<span class="text-lg font-medium text-slate-300"
						>/{rombelData.kapasitas}</span
					>
				</p>
				<!-- Progress bar -->
				<div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
					<div
						class="h-full rounded-full transition-all duration-500
							{capacityPercent >= 90 ? 'bg-red-500' : capacityPercent >= 70 ? 'bg-amber-400' : 'bg-emerald-500'}"
						style="width: {Math.min(capacityPercent, 100)}%"
					></div>
				</div>
			</div>

			<!-- Status Filter Cards -->
			<button
				on:click={() => (statusFilter = statusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
				class="rounded-xl border-2 bg-white p-5 text-left transition-all hover:shadow-sm
					{statusFilter === 'ACTIVE'
					? 'border-emerald-500 ring-2 ring-emerald-500/10'
					: 'border-transparent'}"
			>
				<div class="flex items-center gap-2.5">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
						<svg
							class="h-4 w-4 text-emerald-600"
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
					<div>
						<span class="block text-[11px] font-semibold tracking-wide text-slate-400 uppercase"
							>Aktif</span
						>
						<span class="text-xl font-bold text-slate-800">{activeCount}</span>
					</div>
				</div>
			</button>

			<button
				on:click={() => (statusFilter = statusFilter === 'MUTASI' ? 'ALL' : 'MUTASI')}
				class="rounded-xl border-2 bg-white p-5 text-left transition-all hover:shadow-sm
					{statusFilter === 'MUTASI' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-transparent'}"
			>
				<div class="flex items-center gap-2.5">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
						<svg
							class="h-4 w-4 text-amber-600"
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
					<div>
						<span class="block text-[11px] font-semibold tracking-wide text-slate-400 uppercase"
							>Mutasi</span
						>
						<span class="text-xl font-bold text-slate-800">{mutasiCount}</span>
					</div>
				</div>
			</button>

			<button
				on:click={() => (statusFilter = statusFilter === 'GRADUATE' ? 'ALL' : 'GRADUATE')}
				class="rounded-xl border-2 bg-white p-5 text-left transition-all hover:shadow-sm
					{statusFilter === 'GRADUATE' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-transparent'}"
			>
				<div class="flex items-center gap-2.5">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
						<svg
							class="h-4 w-4 text-blue-600"
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
					<div>
						<span class="block text-[11px] font-semibold tracking-wide text-slate-400 uppercase"
							>Lulus</span
						>
						<span class="text-xl font-bold text-slate-800">{graduateCount}</span>
					</div>
				</div>
			</button>
		</div>

		<!-- Info Pills -->
		<div class="flex flex-wrap items-center gap-2">
			<div
				class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5"
			>
				<svg
					class="h-3.5 w-3.5 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					/>
				</svg>
				<span class="text-xs text-slate-600">{rombelData.ruangan || 'Belum diatur'}</span>
			</div>
			<div
				class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5"
			>
				<svg
					class="h-3.5 w-3.5 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
				<span class="text-xs text-slate-600">{rombelData.kurikulum || 'Belum diatur'}</span>
			</div>
		</div>

		<!-- Student Table Card -->
		<div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
			<!-- Table Header with Search -->
			<div
				class="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between"
			>
				<div class="flex items-center gap-3">
					<h2 class="text-sm font-semibold text-slate-800">Daftar Siswa</h2>
					<span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
						{filteredStudents.length}
					</span>
				</div>

				<div class="flex items-center gap-2">
					<!-- Search -->
					<div class="relative">
						<svg
							class="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400"
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
							placeholder="Cari siswa..."
							bind:value={searchQuery}
							class="w-44 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none md:w-52"
						/>
					</div>

					<!-- Filter -->
					<select
						bind:value={statusFilter}
						class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
					>
						<option value="ACTIVE">Aktif</option>
						<option value="GRADUATE">Lulus</option>
						<option value="MUTASI">Mutasi</option>
						<option value="ALL">Semua</option>
					</select>

					{#if statusFilter !== 'ALL' || searchQuery}
						<button
							on:click={() => {
								statusFilter = 'ALL';
								searchQuery = '';
							}}
							class="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
						>
							Reset
						</button>
					{/if}
				</div>
			</div>

			<!-- Table -->
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-slate-100 bg-slate-50/50">
							<th
								class="w-12 px-5 py-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase"
								>No</th
							>
							<th
								class="px-5 py-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase"
								>Nama Siswa</th
							>
							<th
								class="px-5 py-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase"
								>NISN</th
							>
							<th
								class="px-5 py-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase"
								>Jenis Kelamin</th
							>
							<th
								class="px-5 py-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase"
								>Status</th
							>
							<th
								class="px-5 py-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase"
								>Aksi</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-50">
						{#if filteredStudents.length === 0}
							<tr>
								<td colspan="6" class="px-5 py-16 text-center">
									<div class="flex flex-col items-center">
										<svg
											class="mb-3 h-10 w-10 text-slate-200"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="1.5"
												d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										<p class="text-sm font-medium text-slate-500">
											{#if searchQuery || statusFilter !== 'ALL'}
												Tidak ada siswa yang sesuai filter
											{:else}
												Belum ada siswa di rombel ini
											{/if}
										</p>
										<p class="mt-0.5 text-xs text-slate-400">
											{#if searchQuery || statusFilter !== 'ALL'}
												Coba ubah filter atau kata kunci
											{:else}
												Klik "Tambah Siswa" untuk memulai
											{/if}
										</p>
									</div>
								</td>
							</tr>
						{:else}
							{#each filteredStudents as student, i (student.id)}
								<tr class="group transition-colors hover:bg-slate-50/80">
									<td class="px-5 py-3.5 text-xs text-slate-400">{i + 1}</td>
									<td class="px-5 py-3.5">
										<div class="flex items-center gap-3">
											<div
												class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
												{student.gender === 'L' || student.gender === 'Laki-laki'
													? 'bg-blue-50 text-blue-600'
													: 'bg-pink-50 text-pink-600'}"
											>
												{student.name.charAt(0).toUpperCase()}
											</div>
											<span class="font-medium text-slate-800 capitalize">{student.name}</span>
										</div>
									</td>
									<td class="px-5 py-3.5">
										<span class="font-mono text-xs text-slate-500">{student.nisn}</span>
									</td>
									<td class="px-5 py-3.5">
										<span
											class="rounded-md px-2 py-0.5 text-[11px] font-medium
											{student.gender === 'L' || student.gender === 'Laki-laki'
												? 'bg-blue-50 text-blue-600'
												: 'bg-pink-50 text-pink-600'}"
										>
											{student.gender === 'L' || student.gender === 'Laki-laki'
												? 'Laki-laki'
												: 'Perempuan'}
										</span>
									</td>
									<td class="px-5 py-3.5">
										{#if student.status === 'ACTIVE'}
											<span
												class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
												Aktif
											</span>
										{:else if student.status === 'MUTASI'}
											<span
												class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
												Mutasi
											</span>
										{:else}
											<span
												class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
												Lulus
											</span>
										{/if}
									</td>
									<td class="px-5 py-3.5">
										{#if student.status === 'ACTIVE'}
											<button
												class="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-50"
											>
												Ubah Status
											</button>
										{:else}
											<span class="text-xs text-slate-200">-</span>
										{/if}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>

			<!-- Table Footer -->
			<div class="flex items-center justify-between border-t border-slate-100 px-5 py-3">
				<span class="text-xs text-slate-400">
					{filteredStudents.length} dari {rombelData.students.length} siswa
				</span>
			</div>
		</div>
	{/if}
</div>

<!-- Add Student Slide-over -->
{#if showAddPanel}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-20 flex justify-end" transition:fade={{ duration: 150 }}>
		<!-- Backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="absolute inset-0 bg-black/10 backdrop-blur-sm" on:click={closeAddPanel}></div>

		<!-- Panel -->
		<div
			class="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
			transition:fly={{ x: 500, duration: 250 }}
		>
			<!-- Panel Header -->
			<div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<div>
					<h2 class="text-lg font-bold text-slate-800">Tambah Siswa</h2>
					<p class="text-xs text-slate-400">
						Siswa yang belum memiliki rombel
						{#if availableSlots > 0}
							— <span class="font-medium text-blue-600">{availableSlots} slot tersisa</span>
						{/if}
					</p>
				</div>
				<button
					aria-label="close"
					on:click={closeAddPanel}
					class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Search -->
			<div class="border-b border-slate-100 px-6 py-3">
				<div class="relative">
					<svg
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
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
						bind:value={addSearchQuery}
						class="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Select All Bar -->
			{#if filteredUnassigned.length > 0}
				<div class="flex items-center justify-between border-b border-slate-100 px-6 py-2">
					<label class="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-500">
						<input
							type="checkbox"
							checked={allUnassignedSelected}
							on:change={toggleAllUnassigned}
							class="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
						/>
						Pilih Semua
					</label>
					<span class="text-xs font-medium text-slate-400">
						{selectedNewStudents.length} dipilih
					</span>
				</div>
			{/if}

			<!-- Capacity Warning -->
			{#if isSlotsFull && availableSlots > 0}
				<div
					class="border-b border-amber-200 bg-amber-50 px-6 py-2 text-xs font-medium text-amber-700"
				>
					Slot penuh — {selectedNewStudents.length}/{availableSlots} terpilih
				</div>
			{/if}

			{#if availableSlots <= 0}
				<div class="border-b border-red-200 bg-red-50 px-6 py-2 text-xs font-medium text-red-600">
					Kapasitas rombel sudah penuh
				</div>
			{/if}

			<!-- Student List -->
			<div class="flex-1 overflow-y-auto">
				{#if loadingUnassigned}
					<div class="flex flex-col items-center justify-center py-16">
						<div
							class="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
						></div>
						<span class="mt-3 text-sm text-slate-400">Memuat data siswa...</span>
					</div>
				{:else if filteredUnassigned.length === 0}
					<div class="flex flex-col items-center justify-center py-16">
						<svg
							class="mb-2 h-10 w-10 text-slate-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<p class="text-sm font-medium text-slate-500">
							{addSearchQuery ? 'Tidak ditemukan' : 'Semua siswa sudah memiliki rombel'}
						</p>
					</div>
				{:else}
					<div class="divide-y divide-slate-50">
						{#each filteredUnassigned as student (student.id)}
							{@const isChecked = selectedNewStudents.includes(student.id)}
							{@const isDisabled = !isChecked && isSlotsFull}
							<label
								class="flex cursor-pointer items-center gap-3.5 px-6 py-3 transition-colors
									{isChecked ? 'bg-blue-50/60' : isDisabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-slate-50'}"
							>
								<input
									type="checkbox"
									checked={isChecked}
									disabled={isDisabled}
									on:change={() => toggleNewStudent(student.id)}
									class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
								/>
								<div class="flex-1">
									<p class="text-sm font-medium text-slate-800 capitalize">{student.name}</p>
									<p class="text-xs text-slate-400">{student.nisn}</p>
								</div>
							</label>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Panel Footer -->
			<div class="border-t border-slate-200 px-6 py-4">
				<div class="flex items-center gap-3">
					<button
						on:click={closeAddPanel}
						class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
					>
						Batal
					</button>
					<button
						on:click={saveNewStudents}
						disabled={selectedNewStudents.length === 0 || isSaving}
						class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all
							{selectedNewStudents.length > 0 && !isSaving
							? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md'
							: 'cursor-not-allowed bg-slate-100 text-slate-400'}"
					>
						{#if isSaving}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></div>
							Menyimpan...
						{:else}
							Tambahkan {selectedNewStudents.length} Siswa
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<ModalAlert bind:show={showAlert} type={alertType} message={alertMessage} on:confirm={() => {}} />
