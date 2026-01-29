<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';

	// Type definition
	interface MutasiStudent {
		id: number;
		nisn: string;
		name: string;
		gender: string;
		status: string;
		reason: string;
		mutasiType: string;
		destinationSchool: string | null;
		completionDate: string;
		lastClassName: string | null;
	}

	// State
	let students: MutasiStudent[] = [];
	let isLoading = true;
	let error: string | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let limit = 10;
	let searchQuery = '';

	// Mutasi type labels
	const mutasiTypeLabels: Record<string, string> = {
		pindah_sekolah: 'Pindah Sekolah',
		keluar: 'Keluar',
		dikeluarkan: 'Dikeluarkan',
		meninggal: 'Meninggal Dunia',
		lainnya: 'Lainnya'
	};

	async function fetchMutasiStudents(page: number = 1) {
		isLoading = true;
		error = null;

		try {
			const response = await API_FETCH(`/routes/api/students/dropout?page=${page}&limit=${limit}`);

			if (!response.ok) {
				throw new Error('Gagal mengambil data siswa mutasi');
			}

			const result = await response.json();
			students = result.data || [];

			if (result.pagination) {
				currentPage = result.pagination.page;
				totalPages = result.pagination.totalPages;
			}
		} catch (err) {
			console.error('Error fetching mutasi students:', err);
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	function handlePageChange(newPage: number) {
		if (newPage >= 1 && newPage <= totalPages) {
			fetchMutasiStudents(newPage);
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

	function getMutasiTypeLabel(type: string | null): string {
		if (!type) return '-';
		return mutasiTypeLabels[type] || type;
	}

	// Filter students by search
	$: filteredStudents = students.filter((s) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			s.name.toLowerCase().includes(query) ||
			s.nisn.toString().includes(query) ||
			(s.destinationSchool && s.destinationSchool.toLowerCase().includes(query))
		);
	});

	onMount(() => {
		fetchMutasiStudents();
	});
</script>

<div class="flex flex-col gap-6 p-4 md:p-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div class="flex items-center gap-4">
			<button
				on:click={() => goto('/siswa')}
				class="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
			>
				<ArrowLeft /> Kembali
			</button>
			<div>
				<h1 class="text-2xl font-bold">Data Siswa Mutasi</h1>
				<p class="text-sm opacity-70">Daftar siswa yang telah keluar/pindah</p>
			</div>
		</div>

		<!-- Search -->
		<div class="relative w-full md:w-64">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Cari nama, NISN, atau sekolah..."
				class="w-full rounded-md border px-4 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none"
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

	<!-- Content -->
	{#if isLoading}
		<div class="flex items-center justify-center py-20">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
			<span class="ml-3">Memuat data...</span>
		</div>
	{:else if error}
		<div class="flex flex-col items-center justify-center py-20 text-center">
			<p class="mb-4 text-red-600">{error}</p>
			<button on:click={() => fetchMutasiStudents()} class="rounded-md border px-4 py-2">
				Coba Lagi
			</button>
		</div>
	{:else if filteredStudents.length === 0}
		<div class="rounded-lg border border-dashed py-20 text-center">
			{#if searchQuery}
				<p class="opacity-70">Tidak ada siswa yang sesuai pencarian</p>
			{:else}
				<p class="opacity-70">Belum ada data siswa mutasi</p>
			{/if}
		</div>
	{:else}
		<!-- Table -->
		<div class="overflow-hidden rounded-lg border">
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead class="border-b font-medium uppercase">
						<tr>
							<th class="px-4 py-3">No</th>
							<th class="px-4 py-3">Nama Siswa</th>
							<th class="px-4 py-3">NISN</th>
							<th class="px-4 py-3">Kelas Terakhir</th>
							<th class="px-4 py-3">Jenis Mutasi</th>
							<th class="px-4 py-3">Tanggal</th>
							<th class="px-4 py-3">Sekolah Tujuan</th>
							<th class="px-4 py-3">Alasan</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each filteredStudents as student, i (student.id)}
							<tr class="transition-colors hover:bg-gray-50">
								<td class="px-4 py-3">{(currentPage - 1) * limit + i + 1}</td>
								<td class="px-4 py-3 font-medium capitalize">{student.name}</td>
								<td class="px-4 py-3">{student.nisn}</td>
								<td class="px-4 py-3">{student.lastClassName || '-'}</td>
								<td class="px-4 py-3">
									<span class="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
										{getMutasiTypeLabel(student.mutasiType)}
									</span>
								</td>
								<td class="px-4 py-3">{formatDate(student.completionDate)}</td>
								<td class="px-4 py-3">{student.destinationSchool || '-'}</td>
								<td class="max-w-xs truncate px-4 py-3" title={student.reason}>
									{student.reason || '-'}
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
					Menampilkan {filteredStudents.length} dari {students.length} siswa
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