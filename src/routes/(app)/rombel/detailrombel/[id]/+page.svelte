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

	// Filter state
	let statusFilter: 'ALL' | 'ACTIVE' | 'MUTASI' | 'GRADUATE' = 'ALL';
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
	$: filteredStudents = rombelData?.students.filter((student) => {
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

<div class="p-4 md:p-8">
	<!-- Back Button -->
	<button
		on:click={backToMain}
		class="mb-6 flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
	>
		<ArrowLeft /> Kembali
	</button>

	{#if isLoading}
		<!-- Loading State -->
		<div class="flex items-center justify-center py-20">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
			<span class="ml-3">Memuat data...</span>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="flex flex-col items-center justify-center py-20 text-center">
			<p class="mb-4">{error}</p>
			<button on:click={fetchRombelDetail} class="rounded-md border px-4 py-2"> Coba Lagi </button>
		</div>
	{:else if rombelData}
		<!-- Rombel Header Info -->
		<div class="mb-6 rounded-lg border p-6">
			<div class="mb-4 flex items-start justify-between">
				<div>
					<h1 class="text-2xl font-bold">{rombelData.namaRombel}</h1>
					<p class="text-sm opacity-70">Kode: {rombelData.code}</p>
				</div>
				<div class="text-right">
					<span class="text-sm opacity-70">Kapasitas</span>
					<p class="text-xl font-bold">
						{rombelData.totalSiswa} / {rombelData.kapasitas}
					</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div>
					<span class="text-xs uppercase opacity-70">Tingkat Kelas</span>
					<p class="font-medium">{rombelData.tingkat || '-'}</p>
				</div>
				<div>
					<span class="text-xs uppercase opacity-70">Wali Kelas</span>
					<p class="font-medium">{rombelData.waliKelas || '-'}</p>
				</div>
				<div>
					<span class="text-xs uppercase opacity-70">Ruangan</span>
					<p class="font-medium">{rombelData.ruangan || '-'}</p>
				</div>
				<div>
					<span class="text-xs uppercase opacity-70">Kurikulum</span>
					<p class="font-medium">{rombelData.kurikulum || '-'}</p>
				</div>
			</div>
		</div>

		<!-- Status Summary Cards -->
		<div class="mb-6 grid grid-cols-3 gap-4">
			<button
				on:click={() => (statusFilter = statusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
				class="rounded-lg border p-4 text-left transition-shadow hover:shadow-md"
				class:ring-2={statusFilter === 'ACTIVE'}
			>
				<span class="block text-xs uppercase opacity-70">Aktif</span>
				<span class="block text-2xl font-bold">{activeCount}</span>
			</button>
			<button
				on:click={() => (statusFilter = statusFilter === 'MUTASI' ? 'ALL' : 'MUTASI')}
				class="rounded-lg border p-4 text-left transition-shadow hover:shadow-md"
				class:ring-2={statusFilter === 'MUTASI'}
			>
				<span class="block text-xs uppercase opacity-70">Mutasi</span>
				<span class="block text-2xl font-bold">{mutasiCount}</span>
			</button>
			<button
				on:click={() => (statusFilter = statusFilter === 'GRADUATE' ? 'ALL' : 'GRADUATE')}
				class="rounded-lg border p-4 text-left transition-shadow hover:shadow-md"
				class:ring-2={statusFilter === 'GRADUATE'}
			>
				<span class="block text-xs uppercase opacity-70">Lulus</span>
				<span class="block text-2xl font-bold">{graduateCount}</span>
			</button>
		</div>

		<!-- Search and Filter -->
		<div class="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-2">
				<input
					type="text"
					placeholder="Cari nama atau NISN..."
					bind:value={searchQuery}
					class="w-full rounded-md border px-4 py-2 md:w-64"
				/>
			</div>

			<div class="flex items-center gap-2">
				<label for="statusFilter" class="text-sm">Filter Status:</label>
				<select id="statusFilter" bind:value={statusFilter} class="rounded-md border px-3 py-2">
					<option value="ALL">Semua</option>
					<option value="ACTIVE">Aktif</option>
					<option value="MUTASI">Mutasi</option>
					<option value="GRADUATE">Lulus</option>
				</select>
			</div>
		</div>

		<!-- Students Table -->
		<div class="overflow-hidden rounded-lg border">
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead class="border-b font-medium uppercase">
						<tr>
							<th class="px-4 py-3">No</th>
							<th class="px-4 py-3">Nama Siswa</th>
							<th class="px-4 py-3">NISN</th>
							<th class="px-4 py-3">Jenis Kelamin</th>
							<th class="px-4 py-3">Status</th>
							<th class="px-4 py-3">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#if filteredStudents.length === 0}
							<tr>
								<td colspan="6" class="px-4 py-12 text-center opacity-70">
									{#if searchQuery || statusFilter !== 'ALL'}
										Tidak ada siswa yang sesuai filter
									{:else}
										Belum ada siswa di rombel ini
									{/if}
								</td>
							</tr>
						{:else}
							{#each filteredStudents as student, i (student.id)}
								<tr class="transition-colors hover:bg-gray-50">
									<td class="px-4 py-3">{i + 1}</td>
									<td class="px-4 py-3 font-medium capitalize">{student.name}</td>
									<td class="px-4 py-3">{student.nisn}</td>
									<td class="px-4 py-3 capitalize">{student.gender || '-'}</td>
									<td class="px-4 py-3">
										<span
											class="rounded-full px-2 py-1 text-xs font-medium"
											class:bg-green-100={student.status === 'ACTIVE'}
											class:text-green-800={student.status === 'ACTIVE'}
											class:bg-yellow-100={student.status === 'MUTASI'}
											class:text-yellow-800={student.status === 'MUTASI'}
											class:bg-blue-100={student.status === 'GRADUATE'}
											class:text-blue-800={student.status === 'GRADUATE'}
										>
											{student.status === 'ACTIVE'
												? 'Aktif'
												: student.status === 'MUTASI'
													? 'Mutasi'
													: 'Lulus'}
										</span>
									</td>
									<td class="px-4 py-3">
										{#if student.status === 'ACTIVE'}
											<button class="rounded border px-3 py-1 text-xs font-medium hover:bg-gray-100">
												Ubah Status
											</button>
										{:else}
											<span class="text-xs opacity-50">-</span>
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
		<div class="mt-4 text-sm opacity-70">
			Menampilkan {filteredStudents.length} dari {rombelData.students.length} siswa
		</div>
	{/if}
</div>