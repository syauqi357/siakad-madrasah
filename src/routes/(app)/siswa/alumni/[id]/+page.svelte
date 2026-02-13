<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

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

	// Alert state
	let alertModal = {
		show: false,
		type: 'success' as 'success' | 'error' | 'warning' | 'info',
		message: ''
	};

	function showAlert(type: 'success' | 'error' | 'warning' | 'info', message: string) {
		alertModal = { show: true, type, message };
	}

	// State
	let alumni: AlumniDetail | null = null;
	let isLoading = true;
	let error: string | null = null;
	let parsedScores: Record<string, number> | null = null;

	// Editable fields
	let editCertificateNumber = '';
	let editFinalGrade = '';
	let editGraduationYear = '';
	let isSaving = false;
	let hasChanges = false;

	// Grade options
	const gradeOptions = ['Sangat Baik', 'Baik', 'Cukup', 'Kurang'];

	$: studentId = $page.params.id;

	// Track changes
	$: if (alumni) {
		hasChanges =
			editCertificateNumber !== (alumni.certificateNumber || '') ||
			editFinalGrade !== (alumni.finalGrade || '') ||
			editGraduationYear !== (alumni.graduationYear || '');
	}

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

			// Set editable fields
			editCertificateNumber = alumni?.certificateNumber || '';
			editFinalGrade = alumni?.finalGrade || '';
			editGraduationYear = alumni?.graduationYear || '';

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

	async function saveChanges() {
		if (!alumni || !hasChanges) return;

		isSaving = true;

		try {
			const response = await API_FETCH(`/routes/api/graduates/${studentId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					certificateNumber: editCertificateNumber || null,
					finalGrade: editFinalGrade || null,
					graduationYear: editGraduationYear || null
				})
			});

			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.message || 'Gagal menyimpan data');
			}

			// Update local data
			alumni = {
				...alumni,
				certificateNumber: editCertificateNumber || null,
				finalGrade: editFinalGrade || null,
				graduationYear: editGraduationYear || null
			};

			showAlert('success', 'Data berhasil disimpan');
		} catch (err) {
			showAlert('error', err instanceof Error ? err.message : 'Gagal menyimpan data');
		} finally {
			isSaving = false;
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
<div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 print:bg-white">
	<div class="mx-auto max-w-5xl px-4 py-8 md:px-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/siswa/alumni')}
			class="group mb-6 flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 print:hidden"
		>
			<span class="transition-transform group-hover:-translate-x-1"><ArrowLeft /></span>
			Kembali ke Daftar Alumni
		</button>

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
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
					<!-- error icon placeholder -->
				</div>
				<p class="mb-2 text-lg font-semibold text-slate-800">Terjadi Kesalahan</p>
				<p class="mb-6 text-sm text-slate-500">{error}</p>
				<button
					on:click={() => goto('/siswa/alumni')}
					class="rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600"
				>
					Kembali ke Daftar Alumni
				</button>
			</div>
		{:else if alumni}
			<!-- Header -->
			<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div class="flex items-center gap-4">
					<!-- Avatar placeholder -->
					<div
						class="flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-bold text-white print:from-emerald-600 print:to-emerald-600"
					>
						{alumni.name.charAt(0).toUpperCase()}
					</div>
					<div>
						<div class="flex flex-wrap items-center gap-3">
							<h1 class="text-2xl font-bold text-slate-800 capitalize md:text-3xl">
								{alumni.name}
							</h1>
							<span
								class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700"
							>
								<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
								Alumni
							</span>
						</div>
						<p class="mt-1 font-mono text-sm text-slate-500">NISN: {alumni.nisn}</p>
					</div>
				</div>

				<!-- Print value display -->
				<div class="hidden print:block print:text-right">
					{#if editFinalGrade || alumni.finalGrade}
						<p class="text-xs text-slate-500">Predikat Kelulusan</p>
						<p class="text-lg font-bold text-emerald-700">{editFinalGrade || alumni.finalGrade}</p>
					{/if}
				</div>

				<!-- Screen display with edit -->
				{#if editFinalGrade || alumni.finalGrade}
					<div class="flex flex-col items-end print:hidden">
						<p class="text-xs font-medium tracking-wide text-slate-400 uppercase">
							Predikat Kelulusan
						</p>
						<span
							class="mt-1 rounded-md px-5 py-2 text-lg font-bold {getGradeBadgeClass(
								editFinalGrade || alumni.finalGrade
							)}"
						>
							{editFinalGrade || alumni.finalGrade}
						</span>
					</div>
				{/if}
			</div>

			<!-- Main Content Grid -->
			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Personal Info Card -->
				<div
					class="overflow-hidden rounded-md border border-slate-200 bg-white print:border-slate-300"
				>
					<div class="border-b border-slate-100 bg-slate-50 px-6 py-4 print:bg-slate-100">
						<h2 class="font-semibold text-slate-800">Data Pribadi</h2>
					</div>
					<div class="divide-y divide-slate-100 px-6">
						<div class="flex justify-between py-3">
							<span class="text-sm text-slate-500">Nama Lengkap</span>
							<span class="font-semibold text-slate-800 capitalize">{alumni.name}</span>
						</div>
						<div class="flex justify-between py-3">
							<span class="text-sm text-slate-500">NISN</span>
							<span class="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-sm text-slate-700"
								>{alumni.nisn}</span
							>
						</div>
						{#if alumni.localNis}
							<div class="flex justify-between py-3">
								<span class="text-sm text-slate-500">NIS Lokal</span>
								<span class="font-medium text-slate-700">{alumni.localNis}</span>
							</div>
						{/if}
						<div class="flex justify-between py-3">
							<span class="text-sm text-slate-500">Jenis Kelamin</span>
							<span class="font-medium text-slate-700">{getGenderLabel(alumni.gender)}</span>
						</div>
						{#if alumni.birthPlace || alumni.birthDate}
							<div class="flex justify-between py-3">
								<span class="text-sm text-slate-500">TTL</span>
								<span class="font-medium text-slate-700">
									{alumni.birthPlace || '-'}, {formatDate(alumni.birthDate)}
								</span>
							</div>
						{/if}
						{#if alumni.religion}
							<div class="flex justify-between py-3">
								<span class="text-sm text-slate-500">Agama</span>
								<span class="font-medium text-slate-700 capitalize">{alumni.religion}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Graduation Info Card -->
				<div
					class="overflow-hidden rounded-md border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 print:border-slate-300 print:from-white print:to-white"
				>
					<div class="border-b border-emerald-100 bg-emerald-100/50 px-6 py-4 print:bg-slate-100">
						<h2 class="font-semibold text-emerald-800 print:text-slate-800">Data Kelulusan</h2>
					</div>
					<div class="divide-y divide-emerald-100 px-6 print:divide-slate-100">
						<!-- Tahun Kelulusan - Editable -->
						<div class="flex items-center justify-between py-3">
							<span class="text-sm text-emerald-700 print:text-slate-500">Tahun Kelulusan</span>
							<!-- Print value -->
							<span class="hidden font-bold text-emerald-800 print:inline print:text-slate-800">
								{editGraduationYear || '-'}
							</span>
							<!-- Edit input -->
							<input
								type="text"
								bind:value={editGraduationYear}
								placeholder="2024/2025"
								class="w-32 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-emerald-800 transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none print:hidden"
							/>
						</div>
						<div class="flex items-center justify-between py-3">
							<span class="text-sm text-emerald-700 print:text-slate-500">Tanggal Kelulusan</span>
							<span class="font-medium text-emerald-800 print:text-slate-700"
								>{formatDate(alumni.completionDate)}</span
							>
						</div>
						<div class="flex items-center justify-between py-3">
							<span class="text-sm text-emerald-700 print:text-slate-500">Kelas Terakhir</span>
							<span class="font-medium text-emerald-800 print:text-slate-700">
								{alumni.lastClassName || alumni.lastClassCode || '-'}
								{#if alumni.lastClassLevel}
									<span class="text-emerald-600 print:text-slate-500"
										>({alumni.lastClassLevel})</span
									>
								{/if}
							</span>
						</div>
						<!-- Nomor Ijazah - Editable -->
						<div class="flex items-center justify-between py-3">
							<span class="text-sm text-emerald-700 print:text-slate-500">Nomor Ijazah</span>
							<!-- Print value -->
							<span
								class="hidden font-mono text-sm font-semibold text-emerald-800 print:inline print:text-slate-800"
							>
								{editCertificateNumber || '-'}
							</span>
							<!-- Edit input -->
							<input
								type="text"
								bind:value={editCertificateNumber}
								placeholder="DN-01 Ma 0123456"
								class="w-44 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-right font-mono text-sm text-emerald-800 transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none print:hidden"
							/>
						</div>
						<!-- Predikat - Editable -->
						<div class="flex items-center justify-between py-3">
							<span class="text-sm text-emerald-700 print:text-slate-500">Predikat</span>
							<!-- Print value -->
							<span class="hidden font-semibold text-emerald-800 print:inline print:text-slate-800">
								{editFinalGrade || '-'}
							</span>
							<!-- Edit select -->
							<select
								bind:value={editFinalGrade}
								class="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm font-semibold text-emerald-800 transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none print:hidden"
							>
								<option value="">Pilih predikat</option>
								{#each gradeOptions as grade (grade)}
									<option value={grade}>{grade}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
			</div>

			<!-- Scores Section (if available) -->
			{#if parsedScores && Object.keys(parsedScores).length > 0}
				<div
					class="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white print:border-slate-300"
				>
					<div class="border-b border-slate-100 bg-slate-50 px-6 py-4 print:bg-slate-100">
						<h2 class="font-semibold text-slate-800">Nilai Akhir</h2>
					</div>
					<div class="grid gap-3 p-6 md:grid-cols-2 lg:grid-cols-3">
						{#each Object.entries(parsedScores) as [subject, score] (subject)}
							<div
								class="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3 print:border-slate-200"
							>
								<span class="text-sm text-slate-600 capitalize">
									{subject.replace(/_/g, ' ')}
								</span>
								<span
									class="rounded-lg bg-emerald-100 px-3 py-1 font-bold text-emerald-700 print:bg-slate-100 print:text-slate-800"
								>
									{score}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Additional Notes -->
			{#if alumni.reason}
				<div
					class="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white print:border-slate-300"
				>
					<div class="border-b border-slate-100 bg-slate-50 px-6 py-4 print:bg-slate-100">
						<h2 class="font-semibold text-slate-800">Catatan</h2>
					</div>
					<div class="p-6">
						<p class="text-slate-700">{alumni.reason}</p>
					</div>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="mt-8 flex flex-wrap items-center gap-3 print:hidden">
				{#if hasChanges}
					<button
						on:click={saveChanges}
						disabled={isSaving}
						class="flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50"
					>
						{#if isSaving}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
							Menyimpan...
						{:else}
							Simpan Perubahan
						{/if}
					</button>
				{/if}
				<button
					on:click={() => window.print()}
					class="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
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

<ModalAlert
	show={alertModal.show}
	type={alertModal.type}
	message={alertModal.message}
	on:close={() => (alertModal.show = false)}
	on:confirm={() => (alertModal.show = false)}
/>
