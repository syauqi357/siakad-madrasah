<script lang="ts">
	import { onMount } from 'svelte';
	import StudentScoreTable from '$lib/components/layout/studentScoreTable.svelte';

	// Default demo data (fallback)
	const demoHeaders = ['Nama Siswa', 'NISN', 'UH1', 'UTS', 'UAS', 'Total'];
	const demoData = [
		{
			studentName: 'Ahmad Santoso',
			nisn: '1234567890',
			scores: { UH1: 85, UTS: 90, UAS: 88 },
			total: 87.6
		},
		{
			studentName: 'Budi Pratama',
			nisn: '1234567891',
			scores: { UH1: 78, UTS: 85, UAS: 92 },
			total: 85.0
		}
	];

	let tableHeaders = demoHeaders;
	let tableData = demoData;
	let loading = true;
	let usingRealData = false;
	let subjectName = 'Matematika (Demo)';
	let className = 'X-IPA-1 (Demo)';

	// Dropdown State
	let selectedClassId: number | null = null;
	let classOptions: Array<{ id: number; name: string }> = [];

	async function fetchClassSubjects() {
		try {
			const response = await fetch('http://localhost:3000/routes/api/score/class-subjects');
			if (response.ok) {
				const result = await response.json();
				if (result.success && result.data.length > 0) {
					classOptions = result.data;
					selectedClassId = classOptions[0].id; // Select first one by default
					fetchScores(selectedClassId); // Fetch scores for the first class
				} else {
					console.warn('No class subjects found.');
				}
			}
		} catch (e) {
			console.error('Failed to fetch class subjects:', e);
		}
	}

	async function fetchScores(classId: number | null) {
		if (!classId) return;

		loading = true;
		try {
			const response = await fetch(
				`http://localhost:3000/routes/api/score/scorebyclass?classSubjectId=${classId}`
			);

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

	onMount(() => {
		fetchClassSubjects();
	});

	function handleClassChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedClassId = parseInt(select.value);
		fetchScores(selectedClassId);
	}
</script>

<div class="min-h-screen">
	<!-- login board -->
	<div
		class="flex min-h-screen flex-col items-center justify-center gap-16 bg-[url(/src/lib/image/pattern-randomized.svg)] bg-cover bg-center py-20"
	>
		<div class="flex h-fit w-full flex-col items-center justify-center px-4">
			<div class=" mb-12 flex w-full flex-col items-center gap-3 text-center sm:w-4xl">
				<h1
					class="bg-radial-[at_60%_85%] from-cyan-500 to-blue-800 bg-clip-text text-4xl leading-tight font-bold tracking-wide text-transparent capitalize sm:text-6xl"
				>
					selamat datang di platform akademik madrasah!
				</h1>
				<h3
					class="bg-radial-[at_60%_85%] from-emerald-600 to-cyan-700 bg-clip-text text-lg font-medium text-transparent capitalize sm:text-2xl"
				>
					jaga data dan banyak hal!
				</h3>
			</div>
			<div class="flex flex-wrap items-center justify-center gap-4">
				<a href="/login">
					<button
						class="flex flex-row-reverse items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white capitalize transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
					>
						<span class="h-6 w-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								id="Arrow-Right-Up-Line--Streamline-Mingcute"
								height="24"
								width="24"
							>
								<desc> Arrow Right Up Line Streamline Icon: https://streamlinehq.com </desc>
								<g fill="none" fill-rule="nonzero">
									<path
										d="M24 0v24H0V0h24ZM12.594 23.258l-0.012 0.002 -0.071 0.035 -0.02 0.004 -0.014 -0.004 -0.071 -0.035c-0.01 -0.004 -0.019 -0.001 -0.024 0.005l-0.004 0.01 -0.017 0.428 0.005 0.02 0.01 0.013 0.105 0.074 0.014 0.004 0.012 -0.004 0.104 -0.074 0.012 -0.016 0.004 -0.017 -0.017 -0.427c-0.002 -0.01 -0.009 -0.017 -0.016 -0.018Zm0.264 -0.113 -0.013 0.002 -0.185 0.093 -0.01 0.01 -0.003 0.011 0.018 0.43 0.005 0.012 0.008 0.008 0.201 0.092c0.012 0.004 0.023 0 0.029 -0.008l0.004 -0.014 -0.034 -0.614c-0.003 -0.012 -0.01 -0.02 -0.02 -0.022Zm-0.715 0.002a0.023 0.023 0 0 0 -0.027 0.006l-0.006 0.014 -0.034 0.614c0 0.012 0.007 0.02 0.017 0.024l0.015 -0.002 0.201 -0.092 0.01 -0.009 0.004 -0.011 0.017 -0.43 -0.003 -0.012 -0.01 -0.01 -0.184 -0.092Z"
										stroke-width="1"
									></path>
									<path
										fill="currentColor"
										d="M18 5a1 1 0 0 1 1 1v8a1 1 0 1 1 -2 0V8.414l-9.95 9.95a1 1 0 0 1 -1.414 -1.414L15.586 7H10a1 1 0 1 1 0 -2h8Z"
										stroke-width="1"
									></path>
								</g>
							</svg>
						</span>
						<!-- login -->
						masuk
					</button>
				</a>

				<!-- contribute in another version -->
				<a href="https://github.com/syauqi357" aria-labelledby="contribute">
					<button
						class="text-md flex items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-white/80 px-6 py-3 font-medium text-blue-700 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
					>
						<span class="h-6 w-6">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								id="Github--Streamline-Unicons"
								height="24"
								width="24"
							>
								<path
									d="M11.9999 0.5302c-2.7924 0.0001 -5.4937 0.9939 -7.6204 2.8034C2.2527 5.1431 0.8392 7.6504 0.3919 10.4068c-0.4473 2.7563 0.1008 5.5819 1.5462 7.9712 1.4453 2.3891 3.6937 4.1861 6.3428 5.0693 0.588 0.1029 0.8085 -0.2499 0.8085 -0.5586 0 -0.2793 -0.0147 -1.2054 -0.0147 -2.1903 -2.9547 0.5439 -3.7191 -0.7202 -3.9543 -1.3817 -0.261 -0.6433 -0.6747 -1.2134 -1.2054 -1.6611 -0.4116 -0.2205 -0.9996 -0.7644 -0.0147 -0.7791 0.3761 0.0408 0.7367 0.1717 1.0515 0.3815 0.3147 0.2098 0.5743 0.4925 0.7566 0.8239 0.1608 0.2889 0.3771 0.5433 0.6364 0.7485 0.2593 0.2052 0.5566 0.3573 0.8748 0.4473 0.3182 0.0901 0.651 0.1166 0.9794 0.0779s0.646 -0.1418 0.9344 -0.3035c0.0509 -0.5979 0.3174 -1.1569 0.7498 -1.5729 -2.6166 -0.294 -5.3508 -1.3083 -5.3508 -5.8065 -0.0165 -1.1687 0.4147 -2.2995 1.2054 -3.1604 -0.3595 -1.0158 -0.3175 -2.1306 0.1176 -3.1164 0 0 0.9848 -0.3087 3.234 1.2054 1.9242 -0.5292 3.9556 -0.5292 5.8799 0 2.2491 -1.5288 3.234 -1.2054 3.234 -1.2054 0.4351 0.9858 0.4772 2.1006 0.1176 3.1164 0.7929 0.8594 1.2247 1.9913 1.2054 3.1604 0 4.5129 -2.7489 5.5125 -5.3655 5.8065 0.2806 0.2844 0.4967 0.626 0.6337 1.0013 0.137 0.3755 0.1916 0.776 0.1601 1.1743 0 1.573 -0.0147 2.837 -0.0147 3.2339 0 0.3087 0.2205 0.6762 0.8085 0.5586 2.6444 -0.8903 4.8863 -2.6915 6.3255 -5.0819 1.4393 -2.3905 1.9821 -5.2147 1.5317 -7.9684 -0.4504 -2.7536 -1.8647 -5.2576 -3.9906 -7.0649C17.4892 1.5247 14.7902 0.5317 11.9999 0.5302Z"
									fill="currentColor"
									stroke-width="1"
								></path>
							</svg>
						</span> let's contribute!
					</button>
				</a>
			</div>
		</div>

		<!-- Demo Table Section -->
		<div class="animate-fade-in-up mt-12 w-full max-w-5xl px-4">
			<StudentScoreTable
				headers={tableHeaders}
				data={tableData}
				{className}
				{subjectName}
				{loading}
			>
				<!-- Inject the controls into the slot -->
				<div slot="controls" class="flex items-center gap-3">
					<!-- Class Selector -->
					<select
						class="select select-sm select-bordered w-full max-w-xs bg-white"
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

					{#if usingRealData}
						<span
							class="animate-pulse rounded-full bg-green-100 px-2 py-1 text-xs font-bold whitespace-nowrap text-green-700"
							>LIVE</span
						>
					{:else}
						<span
							class="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold whitespace-nowrap text-slate-500"
							>DEMO</span
						>
					{/if}
				</div>
			</StudentScoreTable>
		</div>
	</div>
</div>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.8s ease-out forwards;
	}
</style>
