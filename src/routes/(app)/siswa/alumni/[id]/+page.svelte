<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';

	// Type definition
	interface AlumniDetail {
		id: number;
		nisn: string;
		localNis: string | null;
		name: string;
		gender: string;
		birthPlace: string | null;
		birthDate: string | null;
		religion: string | null;
		status: string;
		// History data
		historyId: number;
		scores: string | null;
		completionDate: string;
		graduationYear: string | null;
		certificateNumber: string | null;
		finalGrade: string | null;
		reason: string | null;
		// Last class info
		lastRombelId: number | null;
		lastClassName: string | null;
		lastClassCode: string | null;
		lastClassLevel: string | null;
	}

	// State
	let alumni: AlumniDetail | null = null;
	let isLoading = true;
	let error: string | null = null;
	let parsedScores: Record<string, number> | null = null;

	$: studentId = $page.params.id;

	async function fetchAlumniDetail() {
		isLoading = true;
		error = null;

		try {
			const response = await API_FETCH(`/routes/api/graduates/${studentId}`);

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error('Alumni tidak ditemukan');
				}
				throw new Error('Gagal mengambil data alumni');
			}

			alumni = await response.json();

			// Parse scores if exists
			if (alumni?.scores) {
				try {
					parsedScores = JSON.parse(alumni.scores);
				} catch {
					parsedScores = null;
				}
			}
		} catch (err) {
			console.error('Error fetching alumni detail:', err);
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
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

	function getGenderLabel(gender: string | null): string {
		if (!gender) return '-';
		return gender.toLowerCase() === 'l' || gender.toLowerCase() === 'laki-laki'
			? 'Laki-laki'
			: 'Perempuan';
	}

	onMount(() => {
		fetchAlumniDetail();
	});
</script>

<svelte:head>
	<title>{alumni?.name || 'Detail Alumni'} - SIAKAD</title>
</svelte:head>

<!-- Parent container -->
<div class="mx-0 md:mx-30">
	<div class="flex flex-col gap-6 p-4 md:p-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/siswa/alumni')}
			class="flex w-fit items-center gap-2 rounded-full border bg-green-500 px-4 py-2 text-sm text-green-50 capitalize transition-all ease-in-out hover:gap-4 hover:bg-green-700"
		>
			<ArrowLeft />kembali ke daftar alumni
		</button>

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
				<button on:click={() => goto('/siswa/alumni')} class="rounded-md border px-4 py-2">
					Kembali ke Daftar Alumni
				</button>
			</div>
		{:else if alumni}
			<!-- Header -->
			<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					<div class="flex items-center gap-3">
						<h1 class="text-3xl font-bold text-green-700 capitalize">{alumni.name}</h1>
						<span class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
							Alumni
						</span>
					</div>
					<p class="mt-1 text-gray-600">NISN: {alumni.nisn}</p>
				</div>

				{#if alumni.finalGrade}
					<div class="flex flex-col items-end">
						<p class="text-sm text-gray-500">Predikat Kelulusan</p>
						<span
							class="mt-1 rounded-lg border-2 px-4 py-2 text-lg font-bold {getGradeBadgeClass(
								alumni.finalGrade
							)}"
						>
							{alumni.finalGrade}
						</span>
					</div>
				{/if}
			</div>

			<!-- Main Content Grid -->
			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Personal Info Card -->
				<div class="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-800">Data Pribadi</h2>
					<div class="space-y-3">
						<div class="flex justify-between border-b border-gray-100 pb-2">
							<span class="text-gray-600">Nama Lengkap</span>
							<span class="font-medium capitalize">{alumni.name}</span>
						</div>
						<div class="flex justify-between border-b border-gray-100 pb-2">
							<span class="text-gray-600">NISN</span>
							<span class="font-medium">{alumni.nisn}</span>
						</div>
						{#if alumni.localNis}
							<div class="flex justify-between border-b border-gray-100 pb-2">
								<span class="text-gray-600">NIS Lokal</span>
								<span class="font-medium">{alumni.localNis}</span>
							</div>
						{/if}
						<div class="flex justify-between border-b border-gray-100 pb-2">
							<span class="text-gray-600">Jenis Kelamin</span>
							<span class="font-medium">{getGenderLabel(alumni.gender)}</span>
						</div>
						{#if alumni.birthPlace || alumni.birthDate}
							<div class="flex justify-between border-b border-gray-100 pb-2">
								<span class="text-gray-600">Tempat, Tanggal Lahir</span>
								<span class="font-medium">
									{alumni.birthPlace || '-'}, {formatDate(alumni.birthDate)}
								</span>
							</div>
						{/if}
						{#if alumni.religion}
							<div class="flex justify-between">
								<span class="text-gray-600">Agama</span>
								<span class="font-medium capitalize">{alumni.religion}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Graduation Info Card -->
				<div class="rounded-lg border border-green-300 bg-green-50 p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-green-800">Data Kelulusan</h2>
					<div class="space-y-3">
						<div class="flex justify-between border-b border-green-200 pb-2">
							<span class="text-green-700">Tahun Kelulusan</span>
							<span class="font-bold text-green-800">{alumni.graduationYear || '-'}</span>
						</div>
						<div class="flex justify-between border-b border-green-200 pb-2">
							<span class="text-green-700">Tanggal Kelulusan</span>
							<span class="font-medium text-green-800">{formatDate(alumni.completionDate)}</span>
						</div>
						<div class="flex justify-between border-b border-green-200 pb-2">
							<span class="text-green-700">Kelas Terakhir</span>
							<span class="font-medium text-green-800">
								{alumni.lastClassName || alumni.lastClassCode || '-'}
								{#if alumni.lastClassLevel}
									({alumni.lastClassLevel})
								{/if}
							</span>
						</div>
						<div class="flex justify-between border-b border-green-200 pb-2">
							<span class="text-green-700">Nomor Ijazah</span>
							<span class="font-mono text-sm font-medium text-green-800">
								{alumni.certificateNumber || '-'}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-green-700">Predikat</span>
							{#if alumni.finalGrade}
								<span
									class="rounded border px-2 py-0.5 text-sm font-medium {getGradeBadgeClass(
										alumni.finalGrade
									)}"
								>
									{alumni.finalGrade}
								</span>
							{:else}
								<span class="text-green-800">-</span>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Scores Section (if available) -->
			{#if parsedScores && Object.keys(parsedScores).length > 0}
				<div class="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-800">Nilai Akhir</h2>
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{#each Object.entries(parsedScores) as [subject, score]}
							<div class="flex items-center justify-between rounded-md border bg-gray-50 p-3">
								<span class="text-gray-700 capitalize">
									{subject.replace(/_/g, ' ')}
								</span>
								<span class="rounded bg-green-100 px-3 py-1 font-bold text-green-800">
									{score}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Additional Notes -->
			{#if alumni.reason}
				<div class="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-800">Catatan</h2>
					<p class="text-gray-700">{alumni.reason}</p>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="flex gap-3">
				<button
					on:click={() => window.print()}
					class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
				>
					Cetak
				</button>
			</div>
		{/if}
	</div>
</div>

<!--

Done! Here's a summary of the complete Graduate/Alumni feature implementation:

  Backend
  File: backend/src/db/schema/studentHistory.js
  Description: Added graduationYear, certificateNumber, finalGrade fields
  ────────────────────────────────────────
  File: backend/services/graduate.services.js
  Description: Complete graduation service with all functions
  ────────────────────────────────────────
  File: backend/controllers/graduateController.js
  Description: Controller for all graduate endpoints
  ────────────────────────────────────────
  File: backend/routes/api/graduate.js
  Description: Route definitions
  ────────────────────────────────────────
  File: backend/app.js
  Description: Registered graduate routes at /routes/api/graduates
  Frontend
  File: src/lib/components/modal/GraduateModal.svelte
  Description: Modal for graduating a student
  ────────────────────────────────────────
  File: src/routes/(app)/siswa/alumni/+page.svelte
  Description: Alumni list with stats, filters, pagination
  ────────────────────────────────────────
  File: src/routes/(app)/siswa/alumni/[id]/+page.svelte
  Description: Alumni detail page
  ────────────────────────────────────────
  File: src/routes/(app)/siswa/[id]/+page.svelte
  Description: Added "Luluskan Siswa" button
  API Endpoints
  ┌────────┬─────────────────────────────┬─────────────────────────────────┐
  │ Method │          Endpoint           │             Purpose             │
  ├────────┼─────────────────────────────┼─────────────────────────────────┤
  │ GET    │ /routes/api/graduates       │ List alumni (with ?year=filter) │
  ├────────┼─────────────────────────────┼─────────────────────────────────┤
  │ GET    │ /routes/api/graduates/stats │ Get stats (total, by year)      │
  ├────────┼─────────────────────────────┼─────────────────────────────────┤
  │ GET    │ /routes/api/graduates/years │ Get years for dropdown          │
  ├────────┼─────────────────────────────┼─────────────────────────────────┤
  │ GET    │ /routes/api/graduates/:id   │ Get alumni detail               │
  ├────────┼─────────────────────────────┼─────────────────────────────────┤
  │ POST   │ /routes/api/graduates/:id   │ Graduate a student              │
  ├────────┼─────────────────────────────┼─────────────────────────────────┤
  │ POST   │ /routes/api/graduates/bulk  │ Bulk graduate                   │
  ├────────┼─────────────────────────────┼─────────────────────────────────┤
  │ PUT    │ /routes/api/graduates/:id   │ Update alumni data              │
  └────────┴─────────────────────────────┴─────────────────────────────────┘
  SQL Migration Needed

  ALTER TABLE student_history ADD COLUMN graduation_year TEXT;
  ALTER TABLE student_history ADD COLUMN certificate_number TEXT;
  ALTER TABLE student_history ADD COLUMN final_grade TEXT;

  Run these 3 statements to add the new columns to your database.

-->
<style>
	@media print {
		button {
			display: none !important;
		}
	}
</style>
