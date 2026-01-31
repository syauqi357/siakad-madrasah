<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';

	// Type definitions
	interface MutasiStudent {
		id: number;
		nisn: string;
		name: string;
		gender: string;
		status: string;
		reason: string | null;
		completionDate: string;
		lastRombelId: number | null;
		lastClassName: string | null;
		lastClassCode: string | null;
	}

	// State
	let students: MutasiStudent[] = [];
	let isLoading = true;
	let error: string | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalCount = 0;
	let limit = 10;
	let searchQuery = '';

	async function fetchMutasi(page: number = 1) {
		isLoading = true;
		error = null;

		try {
			const url = `/routes/api/students/dropout?page=${page}&limit=${limit}`;
			const response = await API_FETCH(url);

			if (!response.ok) {
				throw new Error('Gagal mengambil data mutasi');
			}

			const result = await response.json();
			students = result.data || [];

			if (result.pagination) {
				currentPage = result.pagination.page;
				totalPages = result.pagination.totalPages;
				totalCount = result.pagination.total;
			}
		} catch (err) {
			console.error('Error fetching mutasi:', err);
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	function handlePageChange(newPage: number) {
		if (newPage >= 1 && newPage <= totalPages) {
			fetchMutasi(newPage);
		}
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		try {
			return new Date(dateStr).toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});
		} catch {
			return dateStr;
		}
	}

	// Filter students by search
	$: filteredStudents = students.filter((s) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			s.name.toLowerCase().includes(query) ||
			s.nisn.toString().includes(query) ||
			(s.reason && s.reason.toLowerCase().includes(query))
		);
	});

	onMount(() => {
		fetchMutasi();
	});
</script>

<!-- Parent container -->
<div class="mx-0 md:mx-30">
	<div class="flex flex-col gap-6 p-4 md:p-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/siswa')}
			class="flex w-fit items-center gap-2 rounded-full border bg-yellow-500 px-4 py-2 text-sm text-yellow-50 capitalize transition-all ease-in-out hover:gap-4 hover:bg-yellow-600"
		>
			<ArrowLeft />kembali
		</button>

		<!-- Header -->
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-4">
				<div>
					<p class="text-3xl font-bold text-yellow-700">Siswa Mutasi</p>
					<p class="text-sm text-gray-600">Daftar siswa yang telah mutasi/pindah</p>
				</div>
			</div>

			<!-- Search -->
			<div class="flex flex-col gap-2 md:flex-row md:items-center">
				<div class="relative w-full md:w-64">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari nama, NISN, atau alasan..."
						class="w-full rounded-md border px-4 py-2 pr-10 text-sm focus:border-yellow-500 focus:outline-none"
					/>
					<svg
						class="absolute top-2.5 right-3 h-4 w-4 opacity-50"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>
		</div>

		<!-- Stats Card -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
				<p class="text-sm text-yellow-600">Total Siswa Mutasi</p>
				<p class="text-2xl font-bold text-yellow-700">{totalCount}</p>
			</div>
		</div>

		<!-- Content -->
		{#if isLoading}
			<div class="flex items-center justify-center py-20">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"
				></div>
				<span class="ml-3">Memuat data...</span>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<p class="mb-4 text-red-600">{error}</p>
				<button on:click={() => fetchMutasi()} class="rounded-md border px-4 py-2">
					Coba Lagi
				</button>
			</div>
		{:else if filteredStudents.length === 0}
			<div class="rounded-lg border border-dashed py-20 text-center">
				{#if searchQuery}
					<p class="opacity-70">Tidak ada siswa mutasi yang sesuai pencarian</p>
				{:else}
					<p class="opacity-70">Belum ada data siswa mutasi</p>
				{/if}
			</div>
		{:else}
			<!-- Table -->
			<div class="overflow-hidden rounded-lg border border-gray-400">
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead class="border-b border-b-gray-400 bg-yellow-50 font-medium uppercase">
							<tr>
								<th class="px-4 py-5">No</th>
								<th class="px-4 py-5">Nama Siswa</th>
								<th class="px-4 py-5">NISN</th>
								<th class="px-4 py-5">Kelas Terakhir</th>
								<th class="px-4 py-5">Tanggal Mutasi</th>
								<th class="px-4 py-5">Alasan</th>
								<th class="px-4 py-5">Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-400">
							{#each filteredStudents as student, i (student.id)}
								<tr class="transition-colors hover:bg-yellow-50">
									<td class="px-4 py-5">{(currentPage - 1) * limit + i + 1}</td>
									<td class="px-4 py-5 font-medium capitalize">{student.name}</td>
									<td class="px-4 py-5">{student.nisn}</td>
									<td class="px-4 py-5">{student.lastClassName || '-'}</td>
									<td class="px-4 py-5">{formatDate(student.completionDate)}</td>
									<td class="max-w-xs truncate px-4 py-5 text-sm">
										{student.reason || '-'}
									</td>
									<td class="px-4 py-5">
										<button
											on:click={() => goto(`/siswa/${student.id}`)}
											class="rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 transition-all hover:bg-yellow-200"
										>
											Detail
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="flex items-center justify-between border-t pt-4">
					<p class="text-sm opacity-70">
						Menampilkan {filteredStudents.length} dari {totalCount} siswa mutasi
					</p>
					<div class="flex items-center gap-2">
						<button
							on:click={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							class="rounded border px-3 py-1 text-sm disabled:opacity-50"
						>
							Prev
						</button>
						<span class="text-sm">
							{currentPage} / {totalPages}
						</span>
						<button
							on:click={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							class="rounded border px-3 py-1 text-sm disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
