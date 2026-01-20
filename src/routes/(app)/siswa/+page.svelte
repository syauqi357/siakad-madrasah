<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import Sort from '$lib/components/icons/sort.svelte';
	import AddIcon from '$lib/components/icons/addIcon.svelte';
	import UploadIcon from '$lib/components/icons/uploadIcon.svelte';
	import DownloadIcon from '$lib/components/icons/downloadIcon.svelte';
	import Arrow_up from '$lib/components/icons/arrow_up.svelte';
	import UploadExcel from '$lib/components/layout/upload/uploadExcel.svelte';

	// Updated Student Type
	type Student = {
		id: number;
		nisn: number | string;
		nama: string;
		kelas: string; // Now populated from backend
		jenisKelamin: string;
		asal: string;
		status: 'aktif' | 'warning' | 'nonaktif';
	};

	const DOWNLOAD_EXCEL_TEMPLATE = import.meta.env.VITE_API_URL;
	const DOWNLOAD_TEMPLATE_EXCEL = `${DOWNLOAD_EXCEL_TEMPLATE}/routes/api/students/download-template`;

	let students: Student[] = [];
	let currentPage = 1;
	let totalPages = 1;
	let limit = 10;
	let loading = false;
	let isUploadModalOpen = false;
	let searchQuery = '';

	const limitOptions = [10, 20, 50, 100];

	async function fetchStudents(page: number) {
		loading = true;
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				goto('/login');
				return;
			}

			// Add search param if needed (backend support required later)
			const url = `/routes/api/studentDataSet?page=${page}&limit=${limit}`;
			const response = await API_FETCH(url);

			if (!response.ok) {
				if (response.status === 401) {
					goto('/login');
					return;
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			const dataFromApi = result.data || [];
			const pagination = result.pagination;

			if (pagination) {
				currentPage = pagination.page;
				totalPages = pagination.totalPages;
			}

			// Transform data
			students = dataFromApi.map((item: any) => ({
				id: item.id,
				nisn: item.nisn || '-',
				nama: item.name,
				kelas: item.className || 'Belum Masuk Rombel', // Use className from backend
				jenisKelamin: item.gender === 'male' || item.gender === 'Laki-laki' ? 'L' : 'P',
				asal: item.originRegion || '-',
				status: 'aktif' // Default active for now as per schema check
			}));
		} catch (error) {
			console.error('Failed to fetch student data:', error);
		} finally {
			loading = false;
		}
	}

	function handlePageChange(newPage: number) {
		if (newPage >= 1 && newPage <= totalPages) {
			fetchStudents(newPage);
		}
	}

	function handleLimitChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		limit = parseInt(select.value);
		currentPage = 1;
		fetchStudents(currentPage);
	}

	// Helper for generating page numbers
	function getPageNumbers(current: number, total: number) {
		const delta = 2;
		const range = [];
		for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
			range.push(i);
		}
		if (current - delta > 2) range.unshift('...');
		if (current + delta < total - 1) range.push('...');
		range.unshift(1);
		if (total !== 1) range.push(total);
		return range;
	}

	async function handleUpload(event: CustomEvent<FormData>) {
		// Upload logic placeholder
		alert('Fitur upload sedang dalam pengembangan.');
	}

	onMount(() => {
		fetchStudents(currentPage);
	});
</script>

<UploadExcel
	isOpen={isUploadModalOpen}
	on:close={() => (isUploadModalOpen = false)}
	on:upload={handleUpload}
/>

<div class="flex flex-col gap-6 p-4 md:p-8">
	<!-- Header Section -->
	<div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Data Siswa</h1>
			<p class="text-sm text-slate-500">Kelola data siswa, kelas, dan status akademik.</p>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<!-- Search -->
			<div class="relative w-full md:w-64">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari nama atau NISN..."
					class="w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:outline-none"
					on:input={() => {}}
				/>
				<!-- Debounce search could be added here -->
				<svg
					class="absolute top-2.5 left-3 h-4 w-4 text-slate-400"
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

			<!-- Actions -->
			<a
				href="/siswa/addStudent"
				class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			>
				<AddIcon /> Tambah
			</a>

			<button
				on:click={() => (isUploadModalOpen = true)}
				class="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				<UploadIcon /> Import
			</button>

			<a
				href={DOWNLOAD_TEMPLATE_EXCEL}
				class="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				<DownloadIcon /> Template
			</a>
		</div>
	</div>

	<!-- Student List (Long Cards) -->
	<div class="flex flex-col gap-3">
		<!-- Header / Column Labels (Optional, mimics table header similar to cards) -->
		<div
			class="hidden grid-cols-12 gap-4 px-6 text-xs font-semibold tracking-wider text-slate-500 uppercase md:grid"
		>
			<div class="col-span-4">Siswa</div>
			<div class="col-span-2">NISN</div>
			<div class="col-span-2">Kelas</div>
			<div class="col-span-1 text-center">L/P</div>
			<div class="col-span-1">Status</div>
			<div class="col-span-1">Asal</div>
			<div class="col-span-1 text-right">Aksi</div>
		</div>

		{#if loading}
			<div class="flex justify-center py-12">
				<span class="loading loading-spinner loading-lg text-blue-600">Loading...</span>
			</div>
		{:else if students.length === 0}
			<div
				class="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-slate-500"
			>
				<p>Belum ada data siswa.</p>
			</div>
		{:else}
			{#each students as student (student.id)}
				<div
					class="grid grid-cols-1 items-center gap-4 border-b border-slate-200 bg-white p-4 last:border-b-0 hover:bg-slate-50 md:grid-cols-12 md:px-6"
				>
					<!-- Name -->
					<div class="col-span-1 md:col-span-4">
						<p class="font-semibold text-slate-800">{student.nama}</p>
						<p class="text-xs text-slate-500 md:hidden">NISN: {student.nisn}</p>
					</div>

					<!-- NISN -->
					<div class="col-span-2 hidden font-mono text-sm text-slate-600 md:block">
						{student.nisn}
					</div>

					<!-- Kelas -->
					<div class="col-span-1 md:col-span-2">
						{#if student.kelas !== 'Belum Masuk Rombel'}
							<span class="text-sm font-medium text-slate-700">
								{student.kelas}
							</span>
						{:else}
							<span class="text-sm text-slate-400 italic">Unassigned</span>
						{/if}
					</div>

					<!-- Gender -->
					<div class="col-span-1 md:col-span-1 md:text-center">
						<span class="font-bold text-slate-600">
							{student.jenisKelamin}
						</span>
					</div>

					<!-- Status -->
					<div class="col-span-1 md:col-span-1">
						<span
							class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize
                            {student.status === 'aktif'
								? 'bg-green-100 text-green-700'
								: student.status === 'warning'
									? 'bg-amber-100 text-amber-700'
									: 'bg-red-100 text-red-700'}"
						>
							{student.status}
						</span>
					</div>

					<!-- Origin -->
					<div class="col-span-1 text-sm text-slate-600 md:col-span-1">
						<span class="mr-1 text-xs text-slate-400 md:hidden">Asal:</span>
						{student.asal}
					</div>

					<!-- Action -->
					<div class="col-span-1 flex justify-end md:col-span-1">
						<button
							on:click={() => goto(`/siswa/${student.id}`)}
							class="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
							title="Lihat Detail"
						>
							selengkapnya <Arrow_up />
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Pagination Footer -->
	<div class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
		<div class="flex items-center gap-2">
			<span class="text-xs text-slate-500">Show</span>
			<select
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
				value={limit}
				on:change={handleLimitChange}
			>
				{#each limitOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center gap-1">
			<button
				class="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-200 disabled:opacity-50"
				on:click={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				Prev
			</button>

			{#each getPageNumbers(currentPage, totalPages) as page}
				{#if page === '...'}
					<span class="px-2 text-sm text-slate-400">...</span>
				{:else}
					<button
						class="min-w-[32px] rounded px-2 py-1 text-sm font-medium {currentPage === page
							? 'bg-blue-600 text-white'
							: 'text-slate-600 hover:bg-slate-200'}"
						on:click={() => handlePageChange(Number(page))}
					>
						{page}
					</button>
				{/if}
			{/each}

			<button
				class="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-200 disabled:opacity-50"
				on:click={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				Next
			</button>
		</div>
	</div>
</div>
