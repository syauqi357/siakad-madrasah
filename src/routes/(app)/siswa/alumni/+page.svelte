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
				return 'bg-emerald-100 text-emerald-800';
			case 'Baik':
				return 'bg-sky-100 text-sky-800';
			case 'Cukup':
				return 'bg-amber-100 text-amber-800';
			case 'Kurang':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-slate-100 text-slate-600';
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
<div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
	<div class="mx-auto max-w-7xl px-4 py-8 md:px-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/siswa')}
			class="group mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50"
		>
			<span class="transition-transform group-hover:-translate-x-1"><ArrowLeft /></span>
			Kembali
		</button>

		<!-- Header -->
		<div class="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-4">
				<!-- icon placeholder -->
				<div
					class="flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600"
				>
					<!-- svg icon here -->
				</div>
				<div>
					<h1 class="text-2xl font-bold text-slate-800 md:text-3xl">Alumni / Lulusan</h1>
					<p class="text-sm text-slate-500">Daftar siswa yang telah lulus dari sekolah</p>
				</div>
			</div>

			<!-- Search & Filter -->
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
				<!-- Year Filter -->
				<select
					bind:value={selectedYear}
					on:change={handleYearFilter}
					class="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
				>
					<option value="">Semua Tahun</option>
					{#each availableYears as year (year)}
						<option value={year}>{year}</option>
					{/each}
				</select>

				<!-- Search -->
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari nama, NISN, atau ijazah..."
						class="w-full rounded-md border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none sm:w-72"
					/>
					<!-- search icon placeholder -->
					<div class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400">
						<!-- svg icon here -->
					</div>
				</div>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
			<!-- Total -->
			<div
				class="relative overflow-hidden rounded-md border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5"
			>
				<div class="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-emerald-500/10"></div>
				<p class="text-xs font-semibold tracking-wide text-emerald-600 uppercase">Total Alumni</p>
				<p class="mt-1 text-3xl font-bold text-emerald-700">{totalCount}</p>
			</div>

			<!-- Per Year Stats -->
			{#each yearStats.slice(0, 5) as stat (stat.year)}
				{#if stat.year}
					<div
						class="rounded-md border border-slate-200 bg-white p-5 transition-all hover:border-slate-300"
					>
						<p class="text-xs font-semibold tracking-wide text-slate-400 uppercase">{stat.year}</p>
						<p class="mt-1 text-3xl font-bold text-slate-800">{stat.count}</p>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Content -->
		{#if isLoading}
			<div class="flex flex-col items-center justify-center py-24">
				<div class="relative h-12 w-12">
					<div
						class="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500"
					></div>
				</div>
				<span class="mt-4 text-sm font-medium text-slate-500">Memuat data...</span>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center py-24 text-center">
				<!-- error icon placeholder -->
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
					<!-- svg icon here -->
				</div>
				<p class="mb-2 text-lg font-semibold text-slate-800">Terjadi Kesalahan</p>
				<p class="mb-6 text-sm text-slate-500">{error}</p>
				<button
					on:click={() => fetchAlumni()}
					class="rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600"
				>
					Coba Lagi
				</button>
			</div>
		{:else if filteredStudents.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-white py-20"
			>
				<!-- empty icon placeholder -->
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
					<!-- svg icon here -->
				</div>
				{#if searchQuery}
					<p class="text-sm font-medium text-slate-600">Tidak ada alumni yang sesuai pencarian</p>
					<p class="mt-1 text-xs text-slate-400">Coba kata kunci lain</p>
				{:else}
					<p class="text-sm font-medium text-slate-600">Belum ada data alumni</p>
					<p class="mt-1 text-xs text-slate-400">Alumni akan muncul setelah siswa diluluskan</p>
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
									>Tahun Lulus</th
								>
								<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
									>No. Ijazah</th
								>
								<th class="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
									>Predikat</th
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
									<td class="px-5 py-4 text-slate-600">{student.lastClassName || '-'}</td>
									<td class="px-5 py-4">
										{#if student.graduationYear}
											<span
												class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
												{student.graduationYear}
											</span>
										{:else}
											<span class="text-slate-300">—</span>
										{/if}
									</td>
									<td class="px-5 py-4">
										{#if student.certificateNumber}
											<span class="font-mono text-xs text-slate-600"
												>{student.certificateNumber}</span
											>
										{:else}
											<span class="text-slate-300">—</span>
										{/if}
									</td>
									<td class="px-5 py-4">
										{#if student.finalGrade}
											<span
												class="rounded-full px-3 py-1 text-xs font-semibold {getGradeBadgeClass(
													student.finalGrade
												)}"
											>
												{student.finalGrade}
											</span>
										{:else}
											<span class="text-slate-300">—</span>
										{/if}
									</td>
									<td class="px-5 py-4">
										<button
											on:click={() => goto(`/siswa/alumni/${student.id}`)}
											class="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
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
						<span class="font-semibold text-slate-700">{totalCount}</span> alumni
					</p>
					<div class="flex items-center gap-2">
						<button
							on:click={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							class="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<!-- arrow left placeholder -->
							Prev
						</button>
						<div class="flex items-center gap-1">
							{#each Array(Math.min(totalPages, 5)) as _, idx (idx)}
								{@const pageNum = idx + 1}
								<button
									on:click={() => handlePageChange(pageNum)}
									class="flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-all {currentPage ===
									pageNum
										? 'bg-emerald-500 text-white'
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
										? 'bg-emerald-500 text-white'
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
							<!-- arrow right placeholder -->
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
