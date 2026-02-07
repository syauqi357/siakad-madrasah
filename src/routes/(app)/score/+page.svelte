<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	const BACKEND_URL = import.meta.env.VITE_API_URL;

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

	let showModal = false;
	let modalType: 'success' | 'error' | 'warning' | 'info' = 'error';
	let modalMessage = '';

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

			const contentType = res.headers.get('content-type');

			if (contentType?.includes('application/json')) {
				const data = await res.json();
				modalType = 'error';
				modalMessage = data.message || 'Gagal mengunduh template';
				showModal = true;
			} else {
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
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-slate-900">Manajemen Nilai</h1>
			<p class="mt-1 text-sm text-slate-500">Upload dan kelola nilai siswa per rombel</p>
		</div>

		<!-- Message Alert -->
		{#if message}
			<div
				class="mb-6 rounded-lg border px-4 py-3 text-sm font-medium {messageType === 'success'
					? 'border-green-200 bg-green-50 text-green-700'
					: 'border-red-200 bg-red-50 text-red-700'}"
			>
				{message}
			</div>
		{/if}

		<!-- Bento Grid -->
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Quick Link: Nilai Tugas -->
			<a
				href="/score/task"
				class="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
			>
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100"
				>
					<svg
						class="h-5 w-5 text-blue-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
						/>
					</svg>
				</div>
				<div>
					<span class="text-sm font-medium text-slate-700 group-hover:text-blue-700"
						>Nilai Tugas</span
					>
					<p class="text-xs text-slate-500">Input nilai tugas harian</p>
				</div>
			</a>

			<!-- Quick Link: Nilai Ujian -->
			<a
				href="/score/exam"
				class="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/50"
			>
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 transition-colors group-hover:bg-emerald-100"
				>
					<svg
						class="h-5 w-5 text-emerald-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
						/>
					</svg>
				</div>
				<div>
					<span class="text-sm font-medium text-slate-700 group-hover:text-emerald-700"
						>Nilai Ujian</span
					>
					<p class="text-xs text-slate-500">Input nilai UTS/UAS</p>
				</div>
			</a>

			<!-- Quick Link: Per Mapel -->
			<a
				href="/score/subject"
				class="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-violet-200 hover:bg-violet-50/50"
			>
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 transition-colors group-hover:bg-violet-100"
				>
					<svg
						class="h-5 w-5 text-violet-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				</div>
				<div>
					<span class="text-sm font-medium text-slate-700 group-hover:text-violet-700"
						>Per Mata Pelajaran</span
					>
					<p class="text-xs text-slate-500">Lihat nilai per mapel</p>
				</div>
			</a>

			<!-- Download Template — spans 1 col on mobile, left side on lg -->
			<div class="rounded-lg border border-slate-200 bg-white sm:col-span-2 lg:col-span-1 lg:row-span-2">
				<div class="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
					<svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
						/>
					</svg>
					<h2 class="text-sm font-semibold text-slate-900">Download Template</h2>
				</div>

				<div class="flex h-[calc(100%-3rem)] flex-col p-5">
					<div class="space-y-4 flex-1">
						<div class="space-y-1.5">
							<label for="rombel" class="text-sm font-medium text-slate-700">Pilih Rombel</label>
							<select
								id="rombel"
								on:change={handleRombelChange}
								class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
							>
								<option value="">-- Pilih Rombel --</option>
								{#each rombels as r}
									<option value={r.id}>{r.namaRombel} - {r.tingkat}</option>
								{/each}
							</select>
						</div>

						<div class="space-y-1.5">
							<label for="subject" class="text-sm font-medium text-slate-700">
								Mata Pelajaran
								<span class="text-xs font-normal text-slate-400">(opsional)</span>
							</label>
							<select
								id="subject"
								bind:value={selectedSubjectId}
								disabled={!selectedRombelId || isLoading}
								class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
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
						class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						{#if isDownloading}
							Mengunduh...
						{:else}
							Download Template
						{/if}
					</button>
				</div>
			</div>

			<!-- Upload Scores — spans 2 cols on lg -->
			<div class="rounded-lg border border-slate-200 bg-white sm:col-span-2 lg:row-span-2">
				<div class="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
					<svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
						/>
					</svg>
					<h2 class="text-sm font-semibold text-slate-900">Upload Nilai</h2>
				</div>

				<div class="flex h-[calc(100%-3rem)] flex-col p-5">
					<div class="flex-1 space-y-4">
						<div class="grid gap-4 sm:grid-cols-2">
							<div class="space-y-1.5">
								<label for="classSubject" class="text-sm font-medium text-slate-700"
									>Kelas - Mata Pelajaran</label
								>
								<select
									id="classSubject"
									bind:value={selectedClassSubjectId}
									class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
								>
									<option value={null}>-- Pilih Kelas-Mapel --</option>
									{#each classSubjects as cs}
										<option value={cs.id}>{cs.name}</option>
									{/each}
								</select>
							</div>

							<div class="space-y-1.5">
								<label for="assessmentType" class="text-sm font-medium text-slate-700"
									>Jenis Penilaian</label
								>
								<select
									id="assessmentType"
									bind:value={selectedAssessmentTypeId}
									class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
						<div class="space-y-1.5">
							<label for="file-upload" class="text-sm font-medium text-slate-700"
								>File Excel (.xlsx)</label
							>
							<input
								type="file"
								id="file-upload"
								accept=".xlsx,.xls"
								on:change={handleFileChange}
								class="w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 transition-colors file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:border-blue-400 hover:bg-blue-50/50 focus:outline-none"
							/>
							{#if uploadFile}
								<p class="flex items-center gap-1.5 text-xs text-blue-600">
									<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									{uploadFile.name}
								</p>
							{/if}
						</div>
					</div>

					<button
						on:click={uploadScores}
						disabled={isUploading ||
							!uploadFile ||
							!selectedClassSubjectId ||
							selectedAssessmentTypeId === null}
						class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
							/>
						</svg>
						{#if isUploading}
							Mengupload...
						{:else}
							Upload Nilai
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Upload Errors — full width below the grid -->
		{#if uploadErrors.length > 0}
			<div class="mt-4 rounded-lg border border-red-200 bg-white">
				<div class="flex items-center gap-2 border-b border-red-200 bg-red-50 px-5 py-3">
					<svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
					<h3 class="text-sm font-medium text-red-700">Beberapa data gagal diproses</h3>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead class="bg-slate-50">
							<tr class="border-b border-slate-200">
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

<ModalAlert bind:show={showModal} type={modalType} message={modalMessage} />
