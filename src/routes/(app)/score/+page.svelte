<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

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
	let isDownloading = false;

	let message = '';
	let messageType: 'success' | 'error' | '' = '';
	let uploadErrors: { row: number; nisn: string; error: string }[] = [];

	// Modal alert state
	let showModal = false;
	let modalType: 'success' | 'error' | 'warning' | 'info' = 'error';
	let modalMessage = '';

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

	async function downloadTemplate() {
		if (!selectedRombelId) {
			modalType = 'warning';
			modalMessage = 'Pilih rombel terlebih dahulu';
			showModal = true;
			return;
		}

		isDownloading = true;

		let url = `${BACKEND_URL}/routes/api/score/template/${selectedRombelId}`;
		if (selectedSubjectId) {
			url += `?subjectId=${selectedSubjectId}`;
		}

		try {
			const res = await fetch(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});

			// Check if response is JSON (error) or file (success)
			const contentType = res.headers.get('content-type');

			if (contentType?.includes('application/json')) {
				// It's an error response
				const data = await res.json();
				modalType = 'error';
				modalMessage = data.message || 'Gagal mengunduh template';
				showModal = true;
			} else {
				// It's a file, trigger download
				const blob = await res.blob();
				const downloadUrl = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = downloadUrl;
				a.download = `template_nilai_rombel_${selectedRombelId}.xlsx`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				window.URL.revokeObjectURL(downloadUrl);

				modalType = 'success';
				modalMessage = 'Template berhasil diunduh';
				showModal = true;
			}
		} catch (err) {
			console.error('Download error:', err);
			modalType = 'error';
			modalMessage = 'Terjadi kesalahan saat mengunduh template';
			showModal = true;
		} finally {
			isDownloading = false;
		}
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

<div class="min-h-screen px-4 py-8 md:px-8">
	<div class="mx-auto max-w-5xl">
		<!-- Header Section -->
		<div class="mb-8">
			<div class="flex items-center gap-4">
				<!-- Icon Placeholder -->
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
					<div class="h-5 w-5 rounded-sm bg-white"></div>
				</div>
				<div>
					<h1 class="text-3xl font-semibold text-blue-700">Manajemen Nilai</h1>
					<p class="text-sm text-slate-500">Upload dan kelola nilai siswa per rombel</p>
				</div>
			</div>
		</div>

		<!-- Message Alert -->
		{#if message}
			<div
				class="mb-6 flex items-center gap-3 rounded-lg p-4 {messageType === 'success'
					? 'border-l-4 border-green-500 bg-green-50 text-green-800'
					: 'border-l-4 border-red-500 bg-red-50 text-red-800'}"
			>
				<div
					class="h-4 w-4 flex-shrink-0 rounded-sm {messageType === 'success'
						? 'bg-green-500'
						: 'bg-red-500'}"
				></div>
				<span class="text-sm font-medium">{message}</span>
			</div>
		{/if}

		<!-- Section 3: Quick Links -->
		<div class="overflow-hidden rounded-lg border border-slate-400 bg-white mb-5 ">
			<div class="border-b border-slate-400 bg-blue-700 px-5 py-3">
				<div class="flex items-center gap-3">

					<h2 class="font-medium text-white">Menu Lainnya</h2>
				</div>
			</div>

			<div class="p-5">
				<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					<a
						href="/score/task"
						class="group flex items-center gap-3 rounded-md border border-slate-400 bg-slate-50 p-3 transition-all hover:border-blue-300 hover:bg-blue-50"
					>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 transition-colors group-hover:bg-blue-500"
						>
							<div class="h-4 w-4 rounded-sm bg-blue-500 group-hover:bg-white"></div>
						</div>
						<div>
							<span class="text-sm font-medium text-slate-700 group-hover:text-blue-700"
							>Nilai Tugas</span
							>
							<p class="text-xs text-slate-500">Input nilai tugas harian</p>
						</div>
					</a>

					<a
						href="/score/exam"
						class="group flex items-center gap-3 rounded-md border border-slate-400 bg-slate-50 p-3 transition-all hover:border-blue-300 hover:bg-blue-50"
					>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 transition-colors group-hover:bg-blue-500"
						>
							<div class="h-4 w-4 rounded-sm bg-blue-500 group-hover:bg-white"></div>
						</div>
						<div>
							<span class="text-sm font-medium text-slate-700 group-hover:text-blue-700"
							>Nilai Ujian</span
							>
							<p class="text-xs text-slate-500">Input nilai UTS/UAS</p>
						</div>
					</a>

					<a
						href="/score/subject"
						class="group flex items-center gap-3 rounded-md border border-slate-400 bg-slate-50 p-3 transition-all hover:border-blue-300 hover:bg-blue-50"
					>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 transition-colors group-hover:bg-blue-500"
						>
							<div class="h-4 w-4 rounded-sm bg-blue-500 group-hover:bg-white"></div>
						</div>
						<div>
							<span class="text-sm font-medium text-slate-700 group-hover:text-blue-700"
							>Per Mata Pelajaran</span
							>
							<p class="text-xs text-slate-500">Lihat nilai per mapel</p>
						</div>
					</a>
				</div>
			</div>
		</div>

		<!-- Section 1: Download Template -->
		<div class="mb-6 overflow-hidden rounded-lg border border-slate-400 bg-white ">
			<div class="border-b border-slate-400 bg-blue-500 px-5 py-3">
				<div class="flex items-center gap-3">
					<div
						class="flex h-6 w-6 items-center justify-center rounded bg-white/20 text-xs font-bold text-white"
					>
						1
					</div>
					<h2 class="font-medium text-white">Download Template Excel</h2>
				</div>
			</div>

			<div class="p-5">
				<div class="grid gap-5 md:grid-cols-2">
					<!-- Rombel Select -->
					<div class="space-y-1.5">
						<label for="rombel" class="text-sm font-medium text-slate-700">Pilih Rombel</label>
						<select
							id="rombel"
							on:change={handleRombelChange}
							class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						>
							<option value="">-- Pilih Rombel --</option>
							{#each rombels as r}
								<option value={r.id}>{r.namaRombel} - {r.tingkat}</option>
							{/each}
						</select>
					</div>

					<!-- Subject Select (optional filter) -->
					<div class="space-y-1.5">
						<label for="subject" class="text-sm font-medium text-slate-700">
							Mata Pelajaran
							<span class="ml-1 text-xs font-normal text-slate-400">(opsional)</span>
						</label>
						<select
							id="subject"
							bind:value={selectedSubjectId}
							disabled={!selectedRombelId || isLoading}
							class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
						>
							<option value={null}>-- Semua Mapel --</option>
							{#each subjects as s}
								<option value={s.id}>{s.name}</option>
							{/each}
						</select>
						{#if isLoading}
							<p class="text-xs text-slate-500">Memuat mata pelajaran...</p>
						{/if}
					</div>
				</div>

				<button
					on:click={downloadTemplate}
					disabled={!selectedRombelId || isDownloading}
					class="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
				>
					<div class="h-4 w-4 rounded-sm bg-white/30"></div>
					{#if isDownloading}
						Mengunduh...
					{:else}
						Download Template
					{/if}
				</button>
			</div>
		</div>

		<!-- Section 2: Upload Scores -->
		<div class="mb-6 overflow-hidden rounded-lg border border-slate-400 bg-white ">
			<div class="border-b border-slate-400 bg-blue-600 px-5 py-3">
				<div class="flex items-center gap-3">
					<div
						class="flex h-6 w-6 items-center justify-center rounded bg-white/20 text-xs font-bold text-white"
					>
						2
					</div>
					<h2 class="font-medium text-white">Upload Nilai</h2>
				</div>
			</div>

			<div class="p-5">
				<div class="grid gap-5 md:grid-cols-2">
					<!-- Class Subject Select -->
					<div class="space-y-1.5">
						<label for="classSubject" class="text-sm font-medium text-slate-700"
							>Kelas - Mata Pelajaran</label
						>
						<select
							id="classSubject"
							bind:value={selectedClassSubjectId}
							class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						>
							<option value={null}>-- Pilih Kelas-Mapel --</option>
							{#each classSubjects as cs}
								<option value={cs.id}>{cs.name}</option>
							{/each}
						</select>
					</div>

					<!-- Assessment Type Select -->
					<div class="space-y-1.5">
						<label for="assessmentType" class="text-sm font-medium text-slate-700"
							>Jenis Penilaian</label
						>
						<select
							id="assessmentType"
							bind:value={selectedAssessmentTypeId}
							class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						>
							<option value={null}>-- Pilih Jenis --</option>
							<option value={0}>-- Semua Jenis (dari template) --</option>
							{#each assessmentTypes as at}
								<option value={at.id}>{at.name} ({at.code})</option>
							{/each}
						</select>
						{#if selectedAssessmentTypeId === 0}
							<p class="text-xs text-blue-600">Upload semua kolom nilai dari template sekaligus</p>
						{/if}
					</div>
				</div>

				<!-- File Upload -->
				<div class="mt-5 space-y-1.5">
					<label for="file-upload" class="text-sm font-medium text-slate-700"
						>File Excel (.xlsx)</label
					>
					<div class="relative">
						<input
							type="file"
							id="file-upload"
							accept=".xlsx,.xls"
							on:change={handleFileChange}
							class="w-full cursor-pointer rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 transition-colors file:mr-3 file:rounded file:border-0 file:bg-blue-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:border-blue-400 hover:bg-blue-50/50 focus:outline-none"
						/>
					</div>
					{#if uploadFile}
						<div class="flex items-center gap-2 text-xs text-blue-600">
							<div class="h-3 w-3 rounded-sm bg-blue-500"></div>
							{uploadFile.name}
						</div>
					{/if}
				</div>

				<button
					on:click={uploadScores}
					disabled={isUploading ||
						!uploadFile ||
						!selectedClassSubjectId ||
						selectedAssessmentTypeId === null}
					class="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
				>
					<div class="h-4 w-4 rounded-sm bg-white/30"></div>
					{#if isUploading}
						Mengupload...
					{:else}
						Upload Nilai
					{/if}
				</button>
			</div>
		</div>

		<!-- Upload Errors (if any) -->
		{#if uploadErrors.length > 0}
			<div class="mb-6 overflow-hidden rounded-lg border border-red-200 bg-white ">
				<div class="border-b border-red-200 bg-red-500 px-5 py-3">
					<div class="flex items-center gap-2">
						<div class="h-4 w-4 rounded-sm bg-white/30"></div>
						<h3 class="text-sm font-medium text-white">Beberapa data gagal diproses</h3>
					</div>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead class="bg-slate-50">
							<tr class="border-b border-slate-400">
								<th
									class="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-slate-600 uppercase"
									>Row</th
								>
								<th
									class="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-slate-600 uppercase"
									>NISN</th
								>
								<th
									class="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-slate-600 uppercase"
									>Error</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#each uploadErrors as err}
								<tr class="hover:bg-slate-50">
									<td class="px-4 py-2.5 font-mono text-slate-600">{err.row}</td>
									<td class="px-4 py-2.5 font-mono text-slate-600">{err.nisn}</td>
									<td class="px-4 py-2.5 text-red-600">{err.error}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}


	</div>
</div>

<!-- Modal Alert -->
<ModalAlert bind:show={showModal} type={modalType} message={modalMessage} />
