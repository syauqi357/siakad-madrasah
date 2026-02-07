<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import StudentScoreTable from '$lib/components/layout/studentScoreTable.svelte';
	import { goto } from '$app/navigation';

	type studentTypes = {
		studentName: string;
		nisn: string;
		scores: number;
	};

	let tableHeaders: string[] = [];
	let tableData: Array<{ studentName: string; nisn: string; scores: Record<string, number> }> = [];
	let loading = true;
	let error = '';
	let subjectName = '';
	let className = '';

	let selectedClassId: number | null = null;
	let classOptions: Array<{ id: number; name: string }> = [];

	async function fetchClassSubjects() {
		try {
			const response = await API_FETCH('/routes/api/score/class-subjects');
			if (!response.ok) throw new Error('Failed to load');

			const result = await response.json();
			if (result.success && result.data.length > 0) {
				classOptions = result.data;
				selectedClassId = classOptions[0].id;
				await fetchScores(selectedClassId);
			}
		} catch (e) {
			console.error('Failed to fetch class subjects:', e);
		} finally {
			loading = false;
		}
	}

	async function fetchScores(classId: number | null) {
		if (!classId) return;

		loading = true;
		error = '';

		try {
			const response = await API_FETCH(`/routes/api/score/scorebyclass?classSubjectId=${classId}`);
			if (!response.ok) throw new Error('Failed to load scores');

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.message || 'No data');
			}

			subjectName = result.subjectName || '';
			className = result.className || '';

			if (result.assessmentTypes?.length > 0) {
				tableHeaders = ['Nama Siswa', 'NISN', ...result.assessmentTypes.map((tablesType: any) => tablesType.code)];
			} else {
				tableHeaders = ['Nama Siswa', 'NISN'];
			}

			tableData = (result.data || []).map((student: studentTypes) => ({
				studentName: student.studentName,
				nisn: student.nisn,
				scores: student.scores || {}
			}));
		} catch (e) {
			error = e instanceof Error ? e.message : 'Gagal memuat data';
			tableData = [];
		} finally {
			loading = false;
		}
	}

	function handleClassChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedClassId = parseInt(select.value);
		fetchScores(selectedClassId);
	}

	onMount(fetchClassSubjects);
</script>

<div class="min-h-screen bg-slate-50">
	<!-- Hero -->
	<div class="px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
		<div class="mx-auto max-w-5xl text-center">
			<p class="text-sm font-medium tracking-wide text-blue-600 uppercase">Sistem Informasi Akademik</p>
			<h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
				Platform Akademik Madrasah
			</h1>
			<p class="mx-auto mt-4 max-w-xl text-base text-slate-500 sm:text-lg">
				Sistem informasi akademik terpadu untuk pengelolaan data siswa, nilai, dan administrasi sekolah.
			</p>
			<div class="mt-8 flex flex-wrap justify-center gap-3">
				<button
					on:click={() => goto('/login')}
					class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
				>
					Masuk ke Dashboard
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
				<a
					href="https://github.com/syauqi357"
					class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 0.5c-6.63 0-12 5.37-12 12 0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.99-.4 3.01-.41 1.02.01 2.05.14 3.01.41 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57 4.76-1.58 8.2-6.08 8.2-11.37 0-6.63-5.37-12-12-12z"
						/>
					</svg>
					Contribute
				</a>
			</div>
		</div>
	</div>

	<!-- Bento Grid -->
	<div class="mx-auto max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16">
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Card 1: Data Siswa (tall) -->
			<div class="row-span-2 flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6">
				<div>
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
						<svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
						</svg>
					</div>
					<h3 class="mt-4 text-lg font-semibold text-slate-900">Data Siswa</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-500">
						Kelola data siswa secara terpusat. Input, edit, dan cari data dengan mudah. Mendukung import dan export data.
					</p>
				</div>
				<div class="mt-6 grid grid-cols-2 gap-2">
					<div class="rounded-md bg-slate-50 px-3 py-2 text-center">
						<p class="text-lg font-bold text-slate-900">NISN</p>
						<p class="text-xs text-slate-400">Tracking</p>
					</div>
					<div class="rounded-md bg-slate-50 px-3 py-2 text-center">
						<p class="text-lg font-bold text-slate-900">NIS</p>
						<p class="text-xs text-slate-400">Tracking</p>
					</div>
				</div>
			</div>

			<!-- Card 2: Penilaian -->
			<div class="rounded-lg border border-slate-200 bg-white p-6">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
					<svg class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
					</svg>
				</div>
				<h3 class="mt-4 text-base font-semibold text-slate-900">Penilaian</h3>
				<p class="mt-1.5 text-sm text-slate-500">Input nilai harian, UTS, UAS dengan sistem assessment fleksibel.</p>
			</div>

			<!-- Card 3: Kelas & Mapel -->
			<div class="rounded-lg border border-slate-200 bg-white p-6">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
					<svg class="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
				<h3 class="mt-4 text-base font-semibold text-slate-900">Kelas & Mapel</h3>
				<p class="mt-1.5 text-sm text-slate-500">Atur kelas, mata pelajaran, dan jadwal pengajaran.</p>
			</div>

			<!-- Card 4: Dokumentasi (wide) -->
			<div class="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:col-span-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
					<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<h3 class="mt-4 text-base font-semibold text-white">Dokumentasi Lengkap</h3>
				<p class="mt-1.5 text-sm text-slate-400">
					API routes, panduan penggunaan, dan arsitektur sistem tersedia di halaman dokumentasi.
				</p>
				<div class="mt-4 flex gap-2">
					<span class="rounded bg-white/10 px-2 py-1 text-xs text-slate-300">REST API</span>
					<span class="rounded bg-white/10 px-2 py-1 text-xs text-slate-300">Express.js</span>
					<span class="rounded bg-white/10 px-2 py-1 text-xs text-slate-300">SvelteKit</span>
				</div>
			</div>

			<!-- Card 5: Laporan -->
			<div class="rounded-lg border border-slate-200 bg-white p-6">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
					<svg class="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</div>
				<h3 class="mt-4 text-base font-semibold text-slate-900">Laporan</h3>
				<p class="mt-1.5 text-sm text-slate-500">Cetak rapor dan rekap nilai per kelas atau per siswa.</p>
			</div>

			<!-- Card 7: Open Source (wide) -->
			<div class="rounded-lg border border-slate-200 bg-white p-6 lg:col-span-1">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
					<svg class="h-5 w-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 0.5c-6.63 0-12 5.37-12 12 0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.99-.4 3.01-.41 1.02.01 2.05.14 3.01.41 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57 4.76-1.58 8.2-6.08 8.2-11.37 0-6.63-5.37-12-12-12z" />
					</svg>
				</div>
				<h3 class="mt-4 text-base font-semibold text-slate-900">Open Source</h3>
				<p class="mt-1.5 text-sm text-slate-500">Kode sumber terbuka, bisa dikembangkan bersama komunitas.</p>
			</div>
		</div>
	</div>

	<!-- Score Table Preview -->
	<div class="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-24">
		<div class="mb-6 text-center">
			<h2 class="text-xl font-bold text-blue-700 sm:text-2xl">Preview Data Nilai</h2>
<!--			<p class="mt-1 text-sm text-slate-500">Contoh tampilan tabel nilai siswa</p>-->
		</div>

		<div class="rounded-lg border border-slate-200 bg-white">
			<StudentScoreTable headers={tableHeaders} data={tableData} {className} {subjectName} {loading}>
				<div slot="controls" class="flex items-center gap-3">
					{#if classOptions.length > 0}
						<select
							class="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500"
							on:change={handleClassChange}
							value={selectedClassId}
						>
							{#each classOptions as option}
								<option value={option.id}>{option.name}</option>
							{/each}
						</select>
					{/if}
				</div>
			</StudentScoreTable>
		</div>

		{#if error}
			<div class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
				{error}
			</div>
		{/if}
	</div>

	<!-- Footer -->
	<div class="border-t border-slate-200 px-4 py-8 text-center">
		<p class="text-sm text-slate-400">SIAKAD Madrasah &middot; Built with SvelteKit & Express.js</p>
	</div>
</div>
