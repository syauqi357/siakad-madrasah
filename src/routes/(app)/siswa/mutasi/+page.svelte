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
<div class="min-h-screen bg-linear-to-br from-slate-50 to-amber-50/30">
	<div class="mx-auto max-w-7xl px-4 py-8 md:px-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/siswa')}
			class="group mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-amber-300 hover:bg-amber-50"
		>
			<span class="transition-transform group-hover:-translate-x-1"><ArrowLeft /></span>
			Kembali
		</button>

		<!-- Header -->
		<div class="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-4">
				<!-- icon -->
				<div
					class="flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-orange-600"
				>
					<svg
						class="h-6 w-6 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
				</div>
				<div>
					<h1 class="text-2xl font-bold text-slate-800 md:text-3xl">Siswa Mutasi</h1>
					<p class="text-sm text-slate-500">
						Data siswa yang sudah tidak aktif karena pindah sekolah
					</p>
				</div>
			</div>

			<!-- Search -->
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari nama, NISN, atau alasan..."
						class="w-full rounded-md border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:outline-none sm:w-72"
					/>
					<div class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400">
						<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
		</div>

		<!-- Stats Card -->
		<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
			<!-- Total -->
			<div
				class="relative overflow-hidden rounded-md border-2 border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 p-5"
			>
				<div class="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-amber-500/10"></div>
				<p class="text-xs font-semibold tracking-wide text-amber-600 uppercase">Total Mutasi</p>
				<p class="mt-1 text-3xl font-bold text-amber-700">{totalCount}</p>
			</div>
		</div>

		<!-- Content -->
		{#if isLoading}
			<div class="flex flex-col items-center justify-center py-24">
				<div class="relative h-12 w-12">
					<div
						class="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500"
					></div>
				</div>
				<span class="mt-4 text-sm font-medium text-slate-500">Memuat data...</span>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center py-24 text-center">
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
					<!-- svg icon here -->
				</div>
				<p class="mb-2 text-lg font-semibold text-slate-800">Terjadi Kesalahan</p>
				<p class="mb-6 text-sm text-slate-500">{error}</p>
				<button
					on:click={() => fetchMutasi()}
					class="rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-amber-600"
				>
					Coba Lagi
				</button>
			</div>
		{:else if filteredStudents.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-white py-20"
			>
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
					<!-- svg icon here -->
				</div>
				{#if searchQuery}
					<p class="text-sm font-medium text-slate-600">
						Tidak ada siswa mutasi yang sesuai pencarian
					</p>
					<p class="mt-1 text-xs text-slate-400">Coba kata kunci lain</p>
				{:else}
					<p class="text-sm font-medium text-slate-600">Belum ada data siswa mutasi</p>
					<p class="mt-1 text-xs text-slate-400">Data akan muncul setelah siswa dimutasi</p>
				{/if}
			</div>
		{:else}
			<!-- Table -->
			<div class="overflow-hidden rounded-md border border-slate-200 bg-white">
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
									>Kelas Terakhir</th
								>
								<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
									>Tanggal Mutasi</th
								>
								<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
									>Alasan</th
								>
								<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
									>Aksi</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#each filteredStudents as student, i (student.id)}
								<tr class="transition-colors hover:bg-slate-50">
									<td class="px-5 py-4 text-slate-500">{(currentPage - 1) * limit + i + 1}</td>
									<td class="px-5 py-4">
										<span class="font-semibold text-slate-800 capitalize">{student.name}</span>
									</td>
									<td class="px-5 py-4">
										<span class="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600"
											>{student.nisn}</span
										>
									</td>
									<td class="px-5 py-4">
										{#if student.lastClassName}
											<span
												class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
												{student.lastClassName}
											</span>
										{:else}
											<span class="text-slate-300">—</span>
										{/if}
									</td>
									<td class="px-5 py-4 text-slate-600">{formatDate(student.completionDate)}</td>
									<td class="max-w-50 px-5 py-4">
										{#if student.reason}
											<span class="block truncate text-slate-600" title={student.reason}>
												{student.reason}
											</span>
										{:else}
											<span class="text-slate-300">—</span>
										{/if}
									</td>
									<td class="px-5 py-4">
										<button
											on:click={() => goto(`/siswa/${student.id}`)}
											class="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
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
				<div
					class="mt-6 flex flex-col items-center justify-between gap-4 rounded-md bg-white/50 px-4 py-3 sm:flex-row"
				>
					<p class="text-sm text-slate-500">
						Menampilkan <span class="font-semibold text-slate-700">{filteredStudents.length}</span>
						dari
						<span class="font-semibold text-slate-700">{totalCount}</span> siswa mutasi
					</p>
					<div class="flex items-center gap-2">
						<button
							on:click={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							class="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							Prev
						</button>
						<div class="flex items-center gap-1">
							{#each Array(Math.min(totalPages, 5)) as _, idx(idx)}
								{@const pageNum = idx + 1}
								<button
									on:click={() => handlePageChange(pageNum)}
									class="flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-all {currentPage ===
									pageNum
										? 'bg-amber-500 text-white'
										: 'text-slate-600 hover:bg-slate-100'}"
								>
									{pageNum}
								</button>
							{/each}
							{#if totalPages > 5}
								<span class="px-2 text-slate-400">...</span>
								<button
									on:click={() => handlePageChange(totalPages)}
									class="flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-all {currentPage ===
									totalPages
										? 'bg-amber-500 text-white'
										: 'text-slate-600 hover:bg-slate-100'}"
								>
									{totalPages}
								</button>
							{/if}
						</div>
						<button
							on:click={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							class="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							Next
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
