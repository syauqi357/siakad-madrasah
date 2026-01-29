<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';

	const BACKEND_URL = import.meta.env.VITE_API_URL;

	// Types
	interface Rombel {
		id: number;
		namaRombel: string;
		tingkat: string;
		waliKelas: string | null;
		ruangan: string | null;
	}

	interface Subject {
		id: number;
		name: string;
		code: string;
	}

	interface AssessmentType {
		id: number;
		code: string;
		name: string;
	}

	interface ClassSubject {
		id: number;
		name: string;
	}

	// State
	let rombels: Rombel[] = [];
	let subjects: Subject[] = [];
	let assessmentTypes: AssessmentType[] = [];
	let classSubjects: ClassSubject[] = [];

	let selectedRombelId: number | null = null;
	let selectedSubjectId: number | null = null;
	let selectedAssessmentTypeId: number | null = null;
	let selectedClassSubjectId: number | null = null;

	let uploadFile: File | null = null;
	let isLoading = false;
	let isUploading = false;

	let message = '';
	let messageType: 'success' | 'error' | '' = '';
	let uploadErrors: { row: number; nisn: string; error: string }[] = [];

	// Fetch rombels on mount
	onMount(async () => {
		await Promise.all([fetchRombels(), fetchAssessmentTypes(), fetchClassSubjects()]);
	});

	async function fetchRombels() {
		try {
			const res = await API_FETCH('/routes/api/rombel');
			const data = await res.json();
			rombels = data.data || [];
		} catch (err) {
			console.error('Failed to fetch rombels:', err);
		}
	}

	async function fetchAssessmentTypes() {
		try {
			const res = await API_FETCH('/routes/api/assessment-types/lite');
			const data = await res.json();
			assessmentTypes = data || [];
		} catch (err) {
			console.error('Failed to fetch assessment types:', err);
		}
	}

	async function fetchClassSubjects() {
		try {
			const res = await API_FETCH('/routes/api/score/class-subjects');
			const data = await res.json();
			classSubjects = data.data || [];
		} catch (err) {
			console.error('Failed to fetch class subjects:', err);
		}
	}

	async function fetchSubjectsForRombel(rombelId: number) {
		isLoading = true;
		subjects = [];
		selectedSubjectId = null;

		try {
			const res = await API_FETCH(`/routes/api/score/subjects/${rombelId}`);
			const data = await res.json();
			subjects = data.data || [];
		} catch (err) {
			console.error('Failed to fetch subjects:', err);
		} finally {
			isLoading = false;
		}
	}

	function handleRombelChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		selectedRombelId = target.value ? parseInt(target.value) : null;

		if (selectedRombelId) {
			fetchSubjectsForRombel(selectedRombelId);
		} else {
			subjects = [];
			selectedSubjectId = null;
		}
	}

	function downloadTemplate() {
		if (!selectedRombelId) {
			showMessage('Pilih rombel terlebih dahulu', 'error');
			return;
		}

		let url = `${BACKEND_URL}/routes/api/score/template/${selectedRombelId}`;
		if (selectedSubjectId) {
			url += `?subjectId=${selectedSubjectId}`;
		}

		window.location.href = url;
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		uploadFile = target.files?.[0] || null;
	}

	async function uploadScores() {
		if (!uploadFile) {
			showMessage('Pilih file Excel terlebih dahulu', 'error');
			return;
		}

		if (!selectedClassSubjectId || selectedAssessmentTypeId === null) {
			showMessage('Pilih Kelas-Mapel dan Jenis Penilaian', 'error');
			return;
		}

		isUploading = true;
		uploadErrors = [];
		message = '';

		try {
			const formData = new FormData();
			formData.append('file', uploadFile);
			formData.append('classSubjectId', selectedClassSubjectId.toString());
			formData.append('assessmentTypeId', selectedAssessmentTypeId.toString());

			const res = await fetch(`${BACKEND_URL}/routes/api/score/upload`, {
				method: 'POST',
				body: formData,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});

			const data = await res.json();

			if (data.success) {
				showMessage(data.message, 'success');
				uploadErrors = data.errors || [];
				uploadFile = null;
				// Reset file input
				const fileInput = document.getElementById('file-upload') as HTMLInputElement;
				if (fileInput) fileInput.value = '';
			} else {
				showMessage(data.message || 'Upload gagal', 'error');
			}
		} catch (err) {
			console.error('Upload error:', err);
			showMessage('Terjadi kesalahan saat upload', 'error');
		} finally {
			isUploading = false;
		}
	}

	function showMessage(msg: string, type: 'success' | 'error') {
		message = msg;
		messageType = type;
		setTimeout(() => {
			message = '';
			messageType = '';
		}, 5000);
	}
</script>

<div class="mx-auto max-w-4xl p-4 md:p-8">
	<h1 class="mb-2 text-2xl font-bold">Manajemen Nilai</h1>
	<p class="mb-6 text-gray-600">Upload dan kelola nilai siswa per rombel</p>

	<!-- Message Alert -->
	{#if message}
		<div
			class="mb-4 rounded border p-3 {messageType === 'success'
				? 'border-green-400 bg-green-100 text-green-700'
				: 'border-red-400 bg-red-100 text-red-700'}"
		>
			{message}
		</div>
	{/if}

	<!-- Section 1: Download Template -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-4 text-lg font-semibold">1. Download Template Excel</h2>

		<div class="grid gap-4 md:grid-cols-2">
			<!-- Rombel Select -->
			<div>
				<label for="rombel" class="mb-1 block text-sm font-medium">Pilih Rombel</label>
				<select
					id="rombel"
					on:change={handleRombelChange}
					class="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
				>
					<option value="">-- Pilih Rombel --</option>
					{#each rombels as r}
						<option value={r.id}>{r.namaRombel} - {r.tingkat}</option>
					{/each}
				</select>
			</div>

			<!-- Subject Select (optional filter) -->
			<div>
				<label for="subject" class="mb-1 block text-sm font-medium">Mata Pelajaran (opsional)</label
				>
				<select
					id="subject"
					bind:value={selectedSubjectId}
					disabled={!selectedRombelId || isLoading}
					class="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
				>
					<option value={null}>-- Semua Mapel --</option>
					{#each subjects as s}
						<option value={s.id}>{s.name}</option>
					{/each}
				</select>
				{#if isLoading}
					<p class="mt-1 text-xs text-gray-500">Memuat mata pelajaran...</p>
				{/if}
			</div>
		</div>

		<button
			on:click={downloadTemplate}
			disabled={!selectedRombelId}
			class="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
		>
			Download Template
		</button>
	</div>

	<!-- Section 2: Upload Scores -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-4 text-lg font-semibold">2. Upload Nilai</h2>

		<div class="grid gap-4 md:grid-cols-2">
			<!-- Class Subject Select -->
			<div>
				<label for="classSubject" class="mb-1 block text-sm font-medium"
					>Kelas - Mata Pelajaran</label
				>
				<select
					id="classSubject"
					bind:value={selectedClassSubjectId}
					class="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
				>
					<option value={null}>-- Pilih Kelas-Mapel --</option>
					{#each classSubjects as cs}
						<option value={cs.id}>{cs.name}</option>
					{/each}
				</select>
			</div>

			<!-- Assessment Type Select -->
			<div>
				<label for="assessmentType" class="mb-1 block text-sm font-medium">Jenis Penilaian</label>
				<select
					id="assessmentType"
					bind:value={selectedAssessmentTypeId}
					class="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
				>
					<option value={null}>-- Pilih Jenis --</option>
					<option value={0}>-- Semua Jenis (dari template) --</option>
					{#each assessmentTypes as at}
						<option value={at.id}>{at.name} ({at.code})</option>
					{/each}
				</select>
				{#if selectedAssessmentTypeId === 0}
					<p class="mt-1 text-xs text-blue-600">
						Upload semua kolom nilai dari template sekaligus
					</p>
				{/if}
			</div>
		</div>

		<!-- File Upload -->
		<div class="mt-4">
			<label for="file-upload" class="mb-1 block text-sm font-medium">File Excel (.xlsx)</label>
			<input
				type="file"
				id="file-upload"
				accept=".xlsx,.xls"
				on:change={handleFileChange}
				class="w-full rounded border px-3 py-2"
			/>
		</div>

		<button
			on:click={uploadScores}
			disabled={isUploading ||
				!uploadFile ||
				!selectedClassSubjectId ||
				selectedAssessmentTypeId === null}
			class="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
		>
			{#if isUploading}
				Mengupload...
			{:else}
				Upload Nilai
			{/if}
		</button>
	</div>

	<!-- Upload Errors (if any) -->
	{#if uploadErrors.length > 0}
		<div class="mb-8 rounded border border-yellow-400 bg-yellow-50 p-4">
			<h3 class="mb-2 font-semibold text-yellow-800">Beberapa data gagal diproses:</h3>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b">
						<th class="px-2 py-1 text-left">Row</th>
						<th class="px-2 py-1 text-left">NISN</th>
						<th class="px-2 py-1 text-left">Error</th>
					</tr>
				</thead>
				<tbody>
					{#each uploadErrors as err}
						<tr class="border-b">
							<td class="px-2 py-1">{err.row}</td>
							<td class="px-2 py-1">{err.nisn}</td>
							<td class="px-2 py-1 text-red-600">{err.error}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Section 3: Quick Links -->
	<div class="rounded border p-4">
		<h2 class="mb-4 text-lg font-semibold">3. Menu Lainnya</h2>

		<div class="flex flex-wrap gap-2">
			<a href="/score/task" class="rounded border px-4 py-2 hover:bg-gray-100"> Nilai Tugas </a>
			<a href="/score/exam" class="rounded border px-4 py-2 hover:bg-gray-100"> Nilai Ujian </a>
			<a href="/score/subject" class="rounded border px-4 py-2 hover:bg-gray-100">
				Per Mata Pelajaran
			</a>
		</div>
	</div>
</div>
