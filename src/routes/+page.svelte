<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import StudentScoreTable from '$lib/components/layout/studentScoreTable.svelte';

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

			// Build headers
			if (result.assessmentTypes?.length > 0) {
				tableHeaders = ['Nama Siswa', 'NISN', ...result.assessmentTypes.map((t: any) => t.code)];
			} else {
				tableHeaders = ['Nama Siswa', 'NISN'];
			}

			// Map data
			tableData = (result.data || []).map((student: any) => ({
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

<div class="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
	<!-- Header -->
	<div class="mb-12 max-w-2xl text-center">
		<h1 class="text-3xl font-bold text-slate-800 sm:text-4xl">Platform Akademik Madrasah</h1>
		<p class="mt-2 text-slate-500">Sistem informasi akademik terpadu</p>
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<a
				href="/login"
				class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
			>
				Masuk
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</a>
			<a
				href="https://github.com/syauqi357"
				class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
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

	<!-- Score Table Preview -->
	<div class="w-full max-w-4xl">
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

		{#if error}
			<div class="mt-4 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
				{error}
			</div>
		{/if}
	</div>
</div>
