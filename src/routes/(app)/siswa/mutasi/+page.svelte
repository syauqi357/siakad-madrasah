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
	<div class="flex flex-col gap-5 p-4 md:p-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/siswa')}
			class="group flex bg-amber-200 duration-400 hover:bg-amber-400 px-4 py-2 rounded-full border-amber-500 hover:border-amber-600 border w-fit items-center gap-2 text-sm text-amber-800 transition-all hover:text-amber-900"
		>
			<span class="transition-transform group-hover:-translate-x-0.5"><ArrowLeft /></span>
			Kembali ke Siswa
		</button>

		<!-- Stats banner -->
		<div class="rounded-md border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50 p-5">
			<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<!-- Left: title + big number -->
				<div class="flex items-center gap-5">
					<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-amber-500 text-white shadow-sm">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
					</div>
					<div>
						<h1 class="text-lg font-semibold text-amber-900">Siswa Mutasi</h1>
						<div class="mt-0.5 flex items-baseline gap-2">
							<span class="text-3xl font-bold text-amber-700">{totalCount}</span>
							<span class="text-sm text-amber-600">siswa tercatat</span>
						</div>
					</div>
				</div>

				<!-- Right: search + tip -->
				<div class="flex flex-col items-end gap-1.5">
					<div class="relative w-full md:w-72">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Cari nama, NISN, atau alasan..."
							class="w-full rounded-md border border-amber-400 bg-white px-3 py-2 pl-9 text-sm transition-colors placeholder:text-amber-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all ease-in-out"
						/>
						<svg
							class="absolute top-2.5 left-3 h-4 w-4 text-amber-500"
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
					<p class="hidden text-sm text-amber-700 md:block">
						Data siswa yang sudah tidak aktif karena pindah sekolah
					</p>
				</div>
			</div>
		</div>

		<!-- Content -->
		{#if isLoading}
			<div class="flex items-center justify-center py-20">
				<div
					class="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"
				></div>
				<span class="ml-3 text-sm text-gray-500">Memuat data...</span>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<p class="mb-3 text-sm text-red-600">{error}</p>
				<button
					on:click={() => fetchMutasi()}
					class="rounded-md border border-gray-300 px-4 py-1.5 text-sm transition-colors hover:bg-gray-50"
				>
					Coba Lagi
				</button>
			</div>
		{:else if filteredStudents.length === 0}
			<div class="rounded-md border border-dashed border-gray-300 py-16 text-center">
				{#if searchQuery}
					<p class="text-sm text-gray-500">Tidak ditemukan siswa mutasi untuk "{searchQuery}"</p>
				{:else}
					<p class="text-sm text-gray-500">Belum ada data siswa mutasi</p>
				{/if}
			</div>
		{:else}
			<!-- Table -->
			<div class="overflow-hidden rounded-md border border-gray-200">
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead class="border-b bg-amber-50/60 text-xs font-medium tracking-wide text-amber-900 uppercase">
							<tr>
								<th class="px-4 py-3">No</th>
								<th class="px-4 py-3">Nama Siswa</th>
								<th class="px-4 py-3">NISN</th>
								<th class="px-4 py-3">Kelas Terakhir</th>
								<th class="px-4 py-3">Tanggal Mutasi</th>
								<th class="px-4 py-3">Alasan</th>
								<th class="px-4 py-3 text-center">Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							{#each filteredStudents as student, i (student.id)}
								<tr class="transition-colors hover:bg-amber-50/40">
									<td class="px-4 py-3 text-gray-500">{(currentPage - 1) * limit + i + 1}</td>
									<td class="px-4 py-3 font-medium capitalize text-gray-800">{student.name}</td>
									<td class="px-4 py-3 font-mono text-xs text-gray-600">{student.nisn}</td>
									<td class="px-4 py-3">
										{#if student.lastClassName}
											<span class="inline-block rounded-sm bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
												{student.lastClassName}
											</span>
										{:else}
											<span class="text-gray-400">-</span>
										{/if}
									</td>
									<td class="px-4 py-3 text-gray-600">{formatDate(student.completionDate)}</td>
									<td class="max-w-[200px] px-4 py-3">
										{#if student.reason}
											<span
												class="block truncate text-gray-600"
												title={student.reason}
											>
												{student.reason}
											</span>
										{:else}
											<span class="text-gray-400">-</span>
										{/if}
									</td>
									<td class="px-4 py-3 text-center">
										<button
											on:click={() => goto(`/siswa/${student.id}`)}
											class="rounded-sm border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 transition-all hover:bg-amber-100"
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
				<div class="flex items-center justify-between pt-2">
					<p class="text-xs text-gray-400">
						{(currentPage - 1) * limit + 1}&ndash;{Math.min(currentPage * limit, totalCount)} dari {totalCount}
					</p>
					<div class="flex items-center gap-1">
						<button
							on:click={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							class="rounded-sm border border-gray-200 px-2.5 py-1 text-xs transition-colors hover:bg-gray-50 disabled:opacity-40"
						>
							Prev
						</button>
						<span class="px-2 text-xs text-gray-500">
							{currentPage} / {totalPages}
						</span>
						<button
							on:click={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							class="rounded-sm border border-gray-200 px-2.5 py-1 text-xs transition-colors hover:bg-gray-50 disabled:opacity-40"
						>
							Next
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
