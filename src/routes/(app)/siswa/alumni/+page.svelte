<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';

	// Type definitions
	interface AlumniStudent {
		id: number;
		nisn: string;
		name: string;
		gender: string;
		status: string;
		scores: string | null;
		completionDate: string;
		graduationYear: string | null;
		certificateNumber: string | null;
		finalGrade: string | null;
		lastRombelId: number | null;
		lastClassName: string | null;
		lastClassCode: string | null;
	}

	interface YearStat {
		year: string | null;
		count: number;
	}

	// State
	let students: AlumniStudent[] = [];
	let isLoading = true;
	let error: string | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalCount = 0;
	let limit = 10;
	let searchQuery = '';
	let selectedYear = '';

	// Stats
	let yearStats: YearStat[] = [];
	let availableYears: string[] = [];

	async function fetchAlumniStats() {
		try {
			const response = await API_FETCH('/routes/api/graduates/stats');
			if (response.ok) {
				const result = await response.json();
				totalCount = result.total || 0;
				yearStats = result.byYear || [];
				availableYears = result.years || [];
			}
		} catch (err) {
			console.error('Error fetching alumni stats:', err);
		}
	}

	async function fetchAlumni(page: number = 1) {
		isLoading = true;
		error = null;

		try {
			let url = `/routes/api/graduates?page=${page}&limit=${limit}`;
			if (selectedYear) {
				url += `&year=${encodeURIComponent(selectedYear)}`;
			}

			const response = await API_FETCH(url);

			if (!response.ok) {
				throw new Error('Gagal mengambil data alumni');
			}

			const result = await response.json();
			students = result.data || [];

			if (result.pagination) {
				currentPage = result.pagination.page;
				totalPages = result.pagination.totalPages;
				totalCount = result.pagination.total;
			}
		} catch (err) {
			console.error('Error fetching alumni:', err);
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	function handlePageChange(newPage: number) {
		if (newPage >= 1 && newPage <= totalPages) {
			fetchAlumni(newPage);
		}
	}

	function handleYearFilter() {
		currentPage = 1;
		fetchAlumni(1);
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

	function getGradeBadgeClass(grade: string | null): string {
		switch (grade) {
			case 'Sangat Baik':
				return 'bg-green-100 text-green-800 border-green-300';
			case 'Baik':
				return 'bg-blue-100 text-blue-800 border-blue-300';
			case 'Cukup':
				return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'Kurang':
				return 'bg-red-100 text-red-800 border-red-300';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-300';
		}
	}

	// Filter students by search
	$: filteredStudents = students.filter((s) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			s.name.toLowerCase().includes(query) ||
			s.nisn.toString().includes(query) ||
			(s.certificateNumber && s.certificateNumber.toLowerCase().includes(query))
		);
	});

	onMount(() => {
		fetchAlumniStats();
		fetchAlumni();
	});
</script>

<!-- Parent container -->
<div class="mx-0 md:mx-30">
	<div class="flex flex-col gap-6 p-4 md:p-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/siswa')}
			class="flex w-fit items-center gap-2 rounded-full border bg-green-500 px-4 py-2 text-sm text-green-50 capitalize transition-all ease-in-out hover:gap-4 hover:bg-green-700"
		>
			<ArrowLeft />kembali
		</button>

		<!-- Header -->
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-4">
				<div>
					<p class="text-3xl font-bold text-green-700">Alumni / Lulusan</p>
					<p class="text-sm text-gray-600">Daftar siswa yang telah lulus</p>
				</div>
			</div>

			<!-- Search & Filter -->
			<div class="flex flex-col gap-2 md:flex-row md:items-center">
				<!-- Year Filter -->
				<select
					bind:value={selectedYear}
					on:change={handleYearFilter}
					class="rounded-md border px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
				>
					<option value="">Semua Tahun</option>
					{#each availableYears as year}
						<option value={year}>{year}</option>
					{/each}
				</select>

				<!-- Search -->
				<div class="relative w-full md:w-64">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari nama, NISN, atau ijazah..."
						class="w-full rounded-md border px-4 py-2 pr-10 text-sm focus:border-green-500 focus:outline-none"
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

		<!-- Stats Cards -->
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
			<!-- Total -->
			<div class="rounded-lg border border-green-300 bg-green-50 p-4">
				<p class="text-sm text-green-600">Total Alumni</p>
				<p class="text-2xl font-bold text-green-700">{totalCount}</p>
			</div>

			<!-- Per Year Stats -->
			{#each yearStats.slice(0, 5) as stat}
				{#if stat.year}
					<div class="rounded-lg border border-gray-300 bg-gray-50 p-4">
						<p class="text-sm text-gray-600">{stat.year}</p>
						<p class="text-2xl font-bold text-gray-700">{stat.count}</p>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Content -->
		{#if isLoading}
			<div class="flex items-center justify-center py-20">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"
				></div>
				<span class="ml-3">Memuat data...</span>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<p class="mb-4 text-red-600">{error}</p>
				<button on:click={() => fetchAlumni()} class="rounded-md border px-4 py-2">
					Coba Lagi
				</button>
			</div>
		{:else if filteredStudents.length === 0}
			<div class="rounded-lg border border-dashed py-20 text-center">
				{#if searchQuery}
					<p class="opacity-70">Tidak ada alumni yang sesuai pencarian</p>
				{:else}
					<p class="opacity-70">Belum ada data alumni</p>
				{/if}
			</div>
		{:else}
			<!-- Table -->
			<div class="overflow-hidden rounded-lg border border-gray-400">
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead class="border-b border-b-gray-400 bg-green-50 font-medium uppercase">
							<tr>
								<th class="px-4 py-5">No</th>
								<th class="px-4 py-5">Nama Siswa</th>
								<th class="px-4 py-5">NISN</th>
								<th class="px-4 py-5">Kelas Terakhir</th>
								<th class="px-4 py-5">Tahun Lulus</th>
								<th class="px-4 py-5">No. Ijazah</th>
								<th class="px-4 py-5">Predikat</th>
								<th class="px-4 py-5">Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-400">
							{#each filteredStudents as student, i (student.id)}
								<tr class="transition-colors hover:bg-green-50">
									<td class="px-4 py-5">{(currentPage - 1) * limit + i + 1}</td>
									<td class="px-4 py-5 font-medium capitalize">{student.name}</td>
									<td class="px-4 py-5">{student.nisn}</td>
									<td class="px-4 py-5">{student.lastClassName || '-'}</td>
									<td class="px-4 py-5">
										{#if student.graduationYear}
											<span
												class="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
											>
												{student.graduationYear}
											</span>
										{:else}
											-
										{/if}
									</td>
									<td class="px-4 py-5 font-mono text-xs">{student.certificateNumber || '-'}</td>
									<td class="px-4 py-5">
										{#if student.finalGrade}
											<span
												class="rounded-md border px-2 py-1 text-xs font-medium {getGradeBadgeClass(
													student.finalGrade
												)}"
											>
												{student.finalGrade}
											</span>
										{:else}
											-
										{/if}
									</td>
									<td class="px-4 py-5">
										<button
											on:click={() => goto(`/siswa/alumni/${student.id}`)}
											class="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 transition-all hover:bg-green-200"
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
						Menampilkan {filteredStudents.length} dari {totalCount} alumni
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
