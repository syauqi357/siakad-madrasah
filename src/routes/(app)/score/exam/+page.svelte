<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import StudentScoreTable from '$lib/components/layout/studentScoreTable.svelte';
	import { goto } from '$app/navigation';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	let showInfoAlert = false;

	// Default demo data (fallback)
	const demoHeaders = ['Nama Siswa', 'NISN', 'UH1', 'UTS', 'UAS', 'Total'];
	const demoData = [
		{
			studentName: 'Ahmad Santoso (Demo)',
			nisn: '1234567890',
			scores: { UH1: 85, UTS: 90, UAS: 88 },
			total: 87.6
		},
		{
			studentName: 'Budi Pratama (Demo)',
			nisn: '1234567891',
			scores: { UH1: 78, UTS: 85, UAS: 92 },
			total: 85.0
		}
	];

	let tableHeaders = demoHeaders;
	let tableData = demoData;
	let loading = true;
	let usingRealData = false;
	let subjectName = '-';
	let className = '-';

	// Dropdown State
	let selectedClassId: number | null = null;
	let classOptions: Array<{ id: number; name: string }> = [];

	async function fetchClassSubjects() {
		try {
			const response = await API_FETCH('/routes/api/score/class-subjects');
			if (response.ok) {
				const result = await response.json();
				if (result.success && result.data.length > 0) {
					classOptions = result.data;
					selectedClassId = classOptions[0].id; // Select first one by default
					fetchScores(selectedClassId); // Fetch scores for the first class
				} else {
					console.warn('No class subjects found.');
					loading = false;
				}
			}
		} catch (e) {
			console.error('Failed to fetch class subjects:', e);
			loading = false;
		}
	}

	async function fetchScores(classId: number | null) {
		if (!classId) return;

		loading = true;
		try {
			const response = await API_FETCH(`/routes/api/score/scorebyclass?classSubjectId=${classId}`);

			if (response.ok) {
				const result = await response.json();

				if (result.success) {
					usingRealData = true;
					subjectName = result.subjectName || 'Unknown Subject';
					className = result.className || 'Unknown Class';

					// 1. Build Headers from Assessment Types
					if (result.assessmentTypes && result.assessmentTypes.length > 0) {
						const assessmentCodes = result.assessmentTypes.map((t: any) => t.code);
						tableHeaders = ['Nama Siswa', 'NISN', ...assessmentCodes];
					} else {
						tableHeaders = ['Nama Siswa', 'NISN'];
					}

					// 2. Map Data
					if (result.data && result.data.length > 0) {
						tableData = result.data.map((student: any) => {
							return {
								studentName: student.studentName,
								nisn: student.nisn,
								scores: student.scores || {}
							};
						});
					} else {
						tableData = [];
					}
				} else {
					usingRealData = false;
					subjectName = 'No Data Found';
					tableData = [];
				}
			}
		} catch (e) {
			console.error('Failed to fetch real data, using demo data.', e);
			usingRealData = false;
		} finally {
			loading = false;
		}
	}

	function handleClassChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedClassId = parseInt(select.value);
		fetchScores(selectedClassId);
	}

	function downloadTemplate() {
		showInfoAlert = true;
	}

	onMount(() => {
		fetchClassSubjects();
	});
</script>

<!-- [STYLE] Main Page Wrapper -->
<div class="p-4 md:p-8">
	<!-- [STYLE] Page Header Section (Title & Main Action) -->
	<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
		<div>
			<h1 class="text-3xl font-bold text-slate-900">Manajemen Nilai</h1>
			<p class="text-md text-slate-600">
				Kelola nilai evaluasi siswa berdasarkan Kelas dan Mata Pelajaran.
			</p>
		</div>

		<!-- [STYLE] Exam Management Button -->
		<button
			on:click={() => goto('/score/exammanagement')}
			class="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium  transition-colors hover:bg-blue-600 text-blue-50  hover:text-blue-50"
		>
			manajemen ujian
		</button>
	</div>

	<!-- [STYLE] Score Table Container -->
	<div class="w-full">
		<StudentScoreTable headers={tableHeaders} data={tableData} {className} {subjectName} {loading}>
			<!-- [STYLE] Table Extras/Controls Slot (Dropdown & Status Badge) -->
			<!-- Inject the controls into the slot -->
			<div slot="controls" class="flex items-center gap-3">
				<!-- [STYLE] Class Selector Dropdown -->
				<select
					class="select select-sm select-bordered w-full max-w-xs bg-white outline-none focus:border-blue-500"
					on:change={handleClassChange}
					value={selectedClassId}
				>
					{#if classOptions.length > 0}
						{#each classOptions as option}
							<option value={option.id}>{option.name}</option>
						{/each}
					{:else}
						<option disabled>Loading classes...</option>
					{/if}
				</select>

				<!-- [STYLE] Live/Demo Status Badge -->
				{#if usingRealData}
					<span
						class="animate-pulse rounded-sm bg-green-100 px-2 py-1 text-xs font-bold whitespace-nowrap text-green-700"
						>LIVE</span
					>
				{:else}
					<span
						class="rounded-sm bg-slate-100 px-2 py-1 text-xs font-bold whitespace-nowrap text-slate-500"
						>DEMO</span
					>
				{/if}
			</div>
		</StudentScoreTable>
	</div>
</div>

<ModalAlert
	bind:show={showInfoAlert}
	type="info"
	message="Silakan gunakan fitur Import di halaman Dashboard Guru untuk template umum, atau tunggu update berikutnya untuk template spesifik."
/>
