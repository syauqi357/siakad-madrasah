<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import Modal from './Modal.svelte';
	import ModalAlert from './modalalert.svelte';

	let showAlert = false;
	let alertMessage = '';

	export let show = false;
	export let studentName = '';
	export let studentNisn = '';
	export let isLoading = false;

	const dispatch = createEventDispatcher();

	// Form data
	let graduationYear = '';
	let completionDate = new Date().toISOString().split('T')[0]; // Default to today
	let certificateNumber = '';
	let finalGrade = '';

	// Academic years from API
	interface AcademicYear {
		id: number;
		name: string;
		isActive: number;
	}
	let yearOptions: AcademicYear[] = [];
	let loadingYears = false;

	// Fetch academic years from API
	async function fetchAcademicYears() {
		loadingYears = true;
		try {
			const response = await API_FETCH('/routes/api/academic-years/lite');
			if (response.ok) {
				const result = await response.json();
				yearOptions = result.data || [];
				// Set default to active year if available
				const activeYear = yearOptions.find((y) => y.isActive === 1);
				if (activeYear && !graduationYear) {
					graduationYear = activeYear.name;
				}
			}
		} catch (error) {
			console.error('Error fetching academic years:', error);
			// Fallback to generated years if API fails
			yearOptions = generateFallbackYears();
		} finally {
			loadingYears = false;
		}
	}

	// Fallback year generator if API fails
	function generateFallbackYears(): AcademicYear[] {
		const currentYear = new Date().getFullYear();
		const years: AcademicYear[] = [];
		for (let i = 0; i < 5; i++) {
			const startYear = currentYear - i;
			years.push({
				id: i,
				name: `${startYear - 1}/${startYear}`,
				isActive: i === 0 ? 1 : 0
			});
		}
		return years;
	}

	onMount(() => {
		fetchAcademicYears();
	});

	// Refetch when modal opens
	$: if (show) {
		fetchAcademicYears();
	}

	// Final grade options
	const gradeOptions = [
		{ value: 'Sangat Baik', label: 'Sangat Baik' },
		{ value: 'Baik', label: 'Baik' },
		{ value: 'Cukup', label: 'Cukup' },
		{ value: 'Kurang', label: 'Kurang' }
	];

	function resetForm() {
		graduationYear = '';
		completionDate = new Date().toISOString().split('T')[0];
		certificateNumber = '';
		finalGrade = '';
	}

	function handleClose() {
		dispatch('close');
		resetForm();
	}

	function handleSubmit() {
		// Validation
		if (!graduationYear) {
			alertMessage = 'Tahun kelulusan wajib dipilih';
			showAlert = true;
			return;
		}
		if (!completionDate) {
			alertMessage = 'Tanggal kelulusan wajib diisi';
			showAlert = true;
			return;
		}

		dispatch('submit', {
			graduationYear,
			completionDate,
			certificateNumber: certificateNumber.trim() || null,
			finalGrade: finalGrade || null
		});
	}
</script>

<Modal
	{show}
	title="Luluskan Siswa"
	subtitle={`${studentName} - ${studentNisn}`}
	size="lg"
	on:close={handleClose}
>
	<form id="graduateForm" on:submit|preventDefault={handleSubmit} class="space-y-4">
		<!-- Tahun Kelulusan -->
		<div>
			<label for="graduationYear" class="mb-1 block text-sm font-medium">
				Tahun Kelulusan <span class="text-red-500">*</span>
			</label>
			<select
				id="graduationYear"
				bind:value={graduationYear}
				class="w-full rounded-md border-2 border-slate-400 px-3 py-2 transition-all ease-in-out focus:border-emerald-500 focus:outline-none"
				required
				disabled={loadingYears}
			>
				<option value="" disabled>
					{loadingYears ? 'Memuat...' : 'Pilih tahun kelulusan'}
				</option>
				{#each yearOptions as year}
					<option value={year.name}>
						{year.name}
						{year.isActive === 1 ? '(Aktif)' : ''}
					</option>
				{/each}
			</select>
		</div>

		<!-- Tanggal Kelulusan -->
		<div>
			<label for="completionDate" class="mb-1 block text-sm font-medium">
				Tanggal Kelulusan <span class="text-red-500">*</span>
			</label>
			<input
				type="date"
				id="completionDate"
				bind:value={completionDate}
				class="w-full rounded-md border-2 border-slate-400 px-3 py-2 transition-all ease-in-out focus:border-emerald-500 focus:outline-none"
				required
			/>
		</div>

		<!-- Nomor Ijazah -->
		<div>
			<label for="certificateNumber" class="mb-1 block text-sm font-medium">
				Nomor Ijazah <span class="text-gray-400">(opsional)</span>
			</label>
			<input
				type="text"
				id="certificateNumber"
				bind:value={certificateNumber}
				placeholder="Contoh: DN-01 Ma 0123456"
				class="w-full rounded-md border-2 border-slate-400 px-3 py-2 transition-all ease-in-out focus:border-emerald-500 focus:outline-none"
			/>
		</div>

		<!-- Predikat/Nilai Akhir -->
		<div>
			<label for="finalGrade" class="mb-1 block text-sm font-medium">
				Predikat Kelulusan <span class="text-gray-400">(opsional)</span>
			</label>
			<select
				id="finalGrade"
				bind:value={finalGrade}
				class="w-full rounded-md border-2 border-slate-400 px-3 py-2 transition-all ease-in-out focus:border-emerald-500 focus:outline-none"
			>
				<option value="">Pilih predikat</option>
				{#each gradeOptions as grade}
					<option value={grade.value}>{grade.label}</option>
				{/each}
			</select>
		</div>

		<!-- Info box -->
		<div class="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
			<h2 class="font-semibold">Perhatian:</h2>
			<p>
				Setelah diluluskan, siswa akan dipindahkan dari kelas aktif dan tidak dapat dikembalikan ke
				status aktif.
			</p>
		</div>
	</form>

	<svelte:fragment slot="footer">
		<button
			type="button"
			on:click={handleClose}
			class="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
			disabled={isLoading}
		>
			Batal
		</button>
		<button
			type="submit"
			form="graduateForm"
			class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
			disabled={isLoading}
		>
			{#if isLoading}
				<span class="flex items-center gap-2">
					<span
						class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></span>
					Memproses...
				</span>
			{:else}
				Konfirmasi Kelulusan
			{/if}
		</button>
	</svelte:fragment>
</Modal>

<ModalAlert bind:show={showAlert} type="warning" message={alertMessage} />
