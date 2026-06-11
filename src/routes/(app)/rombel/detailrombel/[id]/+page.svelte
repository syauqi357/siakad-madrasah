<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';
	import RombelEditModal from '$lib/components/modal/RombelEditModal.svelte';
	import RombelAddStudentPanel from '$lib/components/modal/RombelAddStudentPanel.svelte';

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

	interface DropdownItem {
		id: number;
		name: string;
	}

	// --- State ---
	let rombelData: RombelDetail | null = null;
	let isLoading = true;
	let error: string | null = null;

	// Filter state
	let statusFilter: 'ALL' | 'ACTIVE' | 'MUTASI' | 'GRADUATE' = 'ACTIVE';
	let searchQuery = '';

	// Modal states
	let showAddPanel = false;
	let showEditModal = false;
	let showAlert = false;
	let isSaving = false;

	// Alert config
	let alertType: 'success' | 'error' | 'warning' | 'info' = 'success';
	let alertMessage = '';

	// Edit form data
	let editData = {
		nama_rombel: '',
		tingkat_kelas: 0,
		wali_kelas: null as number | null,
		nama_ruangan: '',
		student_capacity: 32,
		kurikulum: ''
	};

	// Dropdown data
	let classesDropdown: DropdownItem[] = [];
	let teachersDropdown: DropdownItem[] = [];
	let curriculumDropdown: { id: number; name: string }[] = [];

	// --- Reactive Properties ---
	$: rombelId = $page.params.id;

	$: filteredStudents =
		rombelData?.students.filter((student) => {
			const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;
			const matchesSearch =
				searchQuery === '' ||
				student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				student.nisn.includes(searchQuery);
			return matchesStatus && matchesSearch;
		}) ?? [];

	$: activeCount = rombelData?.students.filter((s) => s.status === 'ACTIVE').length ?? 0;
	$: mutasiCount = rombelData?.students.filter((s) => s.status === 'MUTASI').length ?? 0;
	$: graduateCount = rombelData?.students.filter((s) => s.status === 'GRADUATE').length ?? 0;

	$: availableSlots = (rombelData?.kapasitas ?? 0) - activeCount;

	// --- Functions ---
	async function fetchRombelDetail() {
		isLoading = true;
		error = null;

		try {
			const response = await API_FETCH(`/routes/api/rombel/${rombelId}`);
			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.message || 'Gagal mengambil detail rombel');
			}

			const result = await response.json();
			if (result.success) {
				rombelData = result.data;
			} else {
				throw new Error(result.message || 'Data tidak valid');
			}
		} catch (err) {
			console.error('Error fetching rombel detail:', err);
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	async function openEditModal() {
		if (!rombelData) return;

		// Map existing data to edit form
		editData = {
			nama_rombel: rombelData.namaRombel,
			tingkat_kelas: rombelData.tingkatId,
			wali_kelas: rombelData.waliKelasId,
			nama_ruangan: rombelData.ruangan || '',
			student_capacity: rombelData.kapasitas,
			kurikulum: rombelData.kurikulum
		};

		// Fetch dropdown data
		try {
			const [classesRes, teachersRes, currRes] = await Promise.all([
				API_FETCH('/routes/api/class-subjects/dropdown/classes'),
				API_FETCH('/routes/api/class-subjects/dropdown/teachers'),
				API_FETCH('/routes/api/curriculum/lite')
			]);

			const [cData, tData, cuData] = await Promise.all([
				classesRes.json(),
				teachersRes.json(),
				currRes.json()
			]);

			if (cData.success) classesDropdown = cData.data;
			if (tData.success) teachersDropdown = tData.data;
			if (cuData.success) curriculumDropdown = cuData.data;

			showEditModal = true;
		} catch (err) {
			console.error('Error fetching dropdowns:', err);
			alertType = 'error';
			alertMessage = 'Gagal memuat data pilihan';
			showAlert = true;
		}
	}

	async function handleEditSubmit(event: CustomEvent<typeof editData>) {
		const submittedData = event.detail;
		isSaving = true;
		try {
			const response = await API_FETCH(`/routes/api/rombel/${rombelId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(submittedData)
			});

			const result = await response.json();
			if (response.ok) {
				showEditModal = false;
				await fetchRombelDetail();
				alertType = 'success';
				alertMessage = 'Rombel berhasil diperbarui';
				showAlert = true;
			} else {
				throw new Error(result.message || 'Gagal memperbarui rombel');
			}
		} catch (err) {
			alertType = 'error';
			alertMessage = err instanceof Error ? err.message : 'Gagal memperbarui rombel';
			showAlert = true;
		} finally {
			isSaving = false;
		}
	}

	function handleAddSuccess(event: CustomEvent<string>) {
		alertType = 'success';
		alertMessage = event.detail;
		showAlert = true;
		fetchRombelDetail();
	}

	function backToMain() {
		goto('/rombel');
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

		<div class="flex items-center gap-3">
			{#if rombelData}
				<button
					on:click={openEditModal}
					class="flex items-center gap-2 rounded-md border border-slate-200 bg-amber-400 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm transition-all hover:bg-amber-500"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
					Edit Rombel
				</button>
				<button
					on:click={() => (showAddPanel = true)}
					class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
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
							Wali Kelas: <span class="font-medium text-slate-600">{rombelData.waliKelas}</span>
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
				<span class="flex items-center gap-2.5">
					<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
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
					</span>
					<span>
						<span class="block text-[11px] font-semibold tracking-wide text-slate-400 uppercase"
							>Aktif</span
						>
						<span class="text-xl font-bold text-slate-800">{activeCount}</span>
					</span>
				</span>
			</button>

			<button
				on:click={() => (statusFilter = statusFilter === 'MUTASI' ? 'ALL' : 'MUTASI')}
				class="rounded-xl border-2 bg-white p-5 text-left transition-all hover:shadow-sm
					{statusFilter === 'MUTASI' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-transparent'}"
			>
				<span class="flex items-center gap-2.5">
					<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
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
					</span>
					<span>
						<span class="block text-[11px] font-semibold tracking-wide text-slate-400 uppercase"
							>Mutasi</span
						>
						<span class="text-xl font-bold text-slate-800">{mutasiCount}</span>
					</span>
				</span>
			</button>

			<button
				on:click={() => (statusFilter = statusFilter === 'GRADUATE' ? 'ALL' : 'GRADUATE')}
				class="rounded-xl border-2 bg-white p-5 text-left transition-all hover:shadow-sm
					{statusFilter === 'GRADUATE' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-transparent'}"
			>
				<span class="flex items-center gap-2.5">
					<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
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
					</span>
					<span>
						<span class="block text-[11px] font-semibold tracking-wide text-slate-400 uppercase"
							>Lulus</span
						>
						<span class="text-xl font-bold text-slate-800">{graduateCount}</span>
					</span>
				</span>
			</button>
		</div>

		<!-- Info Pills -->
		<div class="flex flex-wrap items-center gap-2">
			<div
				class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
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
				class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
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
				<span class="text-xs font-medium text-slate-600"
					>{rombelData.kurikulum || 'Belum diatur'}</span
				>
			</div>
		</div>

		<!-- Student Table Card -->
		<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
								class="px-5 py-3 text-right text-[11px] font-semibold tracking-wider text-slate-400 uppercase"
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
									<td class="px-5 py-3.5 font-mono text-xs text-slate-400">{i + 1}</td>
									<td class="px-5 py-3.5">
										<div class="flex items-center gap-3">
											<div
												class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
												{student.gender?.toLowerCase().startsWith('l')
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
											{student.gender?.toLowerCase().startsWith('l')
												? 'bg-blue-50 text-blue-600'
												: 'bg-pink-50 text-pink-600'}"
										>
											{student.gender?.toLowerCase().startsWith('l') ? 'Laki-laki' : 'Perempuan'}
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
									<td class="px-5 py-3.5 text-right">
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
			<div
				class="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-5 py-3"
			>
				<span class="text-xs text-slate-400">
					Menampilkan {filteredStudents.length} dari {rombelData.students.length} siswa
				</span>
			</div>
		</div>
	{/if}
</div>

<!-- Edit Rombel Modal Component -->
<RombelEditModal
	show={showEditModal}
	{isSaving}
	{activeCount}
	bind:editData
	{classesDropdown}
	{teachersDropdown}
	{curriculumDropdown}
	on:close={() => (showEditModal = false)}
	on:submit={handleEditSubmit}
/>

<!-- Add Student Panel Component -->
<RombelAddStudentPanel
	show={showAddPanel}
	{rombelId}
	{availableSlots}
	on:close={() => (showAddPanel = false)}
	on:success={handleAddSuccess}
/>

<ModalAlert bind:show={showAlert} type={alertType} message={alertMessage} on:confirm={() => {}} />
