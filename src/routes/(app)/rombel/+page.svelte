<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import AddIcon from '$lib/components/icons/addIcon.svelte';

	import SubjectSelectModal from '$lib/components/modal/SubjectSelectModal.svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	// Type definition for Rombel data
	interface Rombel {
		id: number;
		namaRombel: string;
		tingkat: string;
		waliKelas: string | null;
		ruangan: string | null;
		kurikulum: string;
		totalSiswa: number;
		kapasitas: number;
	}

	interface Subject {
		id: number;
		name: string;
		code: string | null;
	}

	let rombelData: Rombel[] = [];
	let isLoading = true;
	let error: string | null = null;
	let downloadingId: number | null = null;
	let deletingId: number | null = null;
	let confirmDeleteRombel: Rombel | null = null;
	let showDeleteModal = false;

	// Modal State
	let showSubjectModal = false;
	let availableSubjects: Subject[] = [];
	let selectedRombelForDownload: { id: number; name: string } | null = null;
	let isFetchingSubjects = false;

	function addrombel() {
		goto('rombel/addrombel');
	}

	// Fetch rombel data from API
	async function fetchRombelData() {
		isLoading = true;
		error = null;
		try {
			const response = await API_FETCH('/routes/api/rombel');
			if (!response.ok) {
				throw new Error('Failed to fetch rombel data');
			}
			const result = await response.json();
			if (result.success && Array.isArray(result.data)) {
				rombelData = result.data;
			} else {
				throw new Error(result.message || 'Invalid data format');
			}
		} catch (err) {
			console.error('Error fetching rombel data:', err);
			error = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data';
		} finally {
			isLoading = false;
		}
	}

	// Step 1: Click Download -> Fetch Subjects & Show Modal
	async function initiateDownload(event: MouseEvent, rombelId: number, rombelName: string) {
		event.stopPropagation();
		downloadingId = rombelId;
		isFetchingSubjects = true;

		try {
			// Fetch subjects for this rombel
			const response = await API_FETCH(`/routes/api/score/subjects/${rombelId}`);
			if (!response.ok) throw new Error('Gagal mengambil data mata pelajaran');

			const result = await response.json();
			if (result.success && result.data.length > 0) {
				// Show modal to select subject
				availableSubjects = result.data;
				selectedRombelForDownload = { id: rombelId, name: rombelName };
				showSubjectModal = true;
			} else {
				// No subjects found? Just download generic template immediately
				await downloadExcelTemplate(rombelId, rombelName, null);
			}
		} catch (err) {
			console.error('Error fetching subjects:', err);
			// Fallback to generic download if subject fetch fails
			await downloadExcelTemplate(rombelId, rombelName, null);
		} finally {
			isFetchingSubjects = false;
			if (!showSubjectModal) downloadingId = null; // Reset if not showing modal
		}
	}

	// Step 2: Actually Download Template (called from Modal or directly)
	async function downloadExcelTemplate(
		rombelId: number,
		rombelName: string,
		subjectId: number | null
	) {
		try {
			const query = subjectId ? `?subjectId=${subjectId}` : '';
			const response = await API_FETCH(`/routes/api/score/template/${rombelId}${query}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Gagal mengunduh template');
			}

			// Determine filename
			let filename = `template_nilai_${rombelName.replace(/\s+/g, '_')}`;
			if (subjectId) {
				const subject = availableSubjects.find((s) => s.id === subjectId);
				if (subject) filename += `_${subject.name.replace(/\s+/g, '_')}`;
			}
			filename += '.xlsx';

			// Download Blob
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Error downloading template:', err);
			alert(err instanceof Error ? err.message : 'Gagal mengunduh template Excel');
		} finally {
			downloadingId = null;
			showSubjectModal = false; // Close modal
		}
	}

	function handleModalDownload(event: CustomEvent<{ subjectId: number }>) {
		if (selectedRombelForDownload) {
			downloadExcelTemplate(
				selectedRombelForDownload.id,
				selectedRombelForDownload.name,
				event.detail.subjectId
			);
		}
	}

	function promptDelete(event: MouseEvent, rom: Rombel) {
		event.stopPropagation();
		confirmDeleteRombel = rom;
		showDeleteModal = true;
	}

	async function handleDelete() {
		if (!confirmDeleteRombel) return;
		const rombelToDelete = confirmDeleteRombel;
		confirmDeleteRombel = null;
		deletingId = rombelToDelete.id;

		try {
			const response = await API_FETCH(`/routes/api/rombel/${rombelToDelete.id}`, {
				method: 'DELETE'
			});
			const result = await response.json();

			if (response.ok && result.success) {
				rombelData = rombelData.filter((r) => r.id !== rombelToDelete.id);
			} else {
				alert(result.message || 'Gagal menghapus rombel');
			}
		} catch (err) {
			console.error('Error deleting rombel:', err);
			alert('Terjadi kesalahan saat menghapus rombel');
		} finally {
			deletingId = null;
		}
	}

	onMount(() => {
		fetchRombelData();
	});

	// Function now accepts an ID
	function detailrombel(id: number) {
		// Use backticks (`) and ${id} to insert the variable into the string
		goto(`rombel/detailrombel/${id}`);
	}
</script>

<div class="mx-auto w-full max-w-full space-y-6 p-6">
	<!-- Header -->
	<div
		class="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center"
	>
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Rombongan Belajar</h1>
			<p class="mt-0.5 text-sm text-slate-500">Kelola rombel dan data siswa per kelas</p>
		</div>
		<button
			on:click={addrombel}
			class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
		>
			<AddIcon />
			Tambah Rombel
		</button>
	</div>

	<!-- Loading State -->
	{#if isLoading}
		<div class="flex flex-col items-center justify-center py-20">
			<div
				class="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
			></div>
			<span class="mt-3 text-sm text-slate-400">Memuat data rombel...</span>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="flex flex-col items-center justify-center py-20">
			<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
				<svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<p class="mb-1 text-sm font-medium text-slate-700">{error}</p>
			<button
				on:click={fetchRombelData}
				class="mt-3 rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
			>
				Coba Lagi
			</button>
		</div>
	{:else if rombelData.length === 0}
		<!-- Empty State -->
		<div class="flex flex-col items-center rounded-lg border border-dashed border-slate-200 py-20">
			<svg
				class="mb-3 h-10 w-10 text-slate-300"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
				/>
			</svg>
			<p class="text-sm text-slate-400">Belum ada data rombongan belajar</p>
			<button
				on:click={addrombel}
				class="mt-4 rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
			>
				Buat Rombel Pertama
			</button>
		</div>
	{:else}
		<!-- Grid -->
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each rombelData as rombel}
				<div
					class="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-lg"
				>
					<!-- Color accent top bar -->
					<div class="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>

					<!-- Clickable Content -->
					<button
						type="button"
						on:click={() => detailrombel(rombel.id)}
						class="flex flex-1 cursor-pointer flex-col p-5 text-left"
					>
						<!-- Header: Name + Tingkat -->
						<div class="flex w-full items-start justify-between gap-3">
							<div class="min-w-0 flex-1">
								<h3 class="truncate text-lg font-bold text-slate-900">{rombel.namaRombel}</h3>
								<p class="mt-1 text-sm text-slate-500 capitalize">
									{rombel.waliKelas || 'Belum ada wali kelas'}
								</p>
							</div>
							<span
								class="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-bold text-white shadow-sm"
							>
								{rombel.tingkat || '-'}
							</span>
						</div>

						<!-- Info Badges -->
						<div class="mt-4 flex flex-wrap gap-2">
							{#if rombel.ruangan}
								<span
									class="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
								>
									{rombel.ruangan}
								</span>
							{/if}
							{#if rombel.kurikulum}
								<span
									class="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
								>
									{rombel.kurikulum}
								</span>
							{/if}
						</div>

						<!-- Student Count -->
						<div class="mt-5 w-full border-t border-slate-100 pt-4">
							<div class="flex items-end justify-between">
								<span class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Siswa</span>
								<span class="text-base font-bold text-slate-800">
									{rombel.totalSiswa}<span class="text-sm font-normal text-slate-400"> / {rombel.kapasitas}</span>
								</span>
							</div>
							<div class="mt-2.5 h-2 w-full rounded-full bg-slate-100">
								<div
									class="h-2 rounded-full transition-all duration-300 {rombel.totalSiswa / rombel.kapasitas >= 0.9
										? 'bg-gradient-to-r from-amber-400 to-red-500'
										: 'bg-gradient-to-r from-blue-400 to-blue-600'}"
									style="width: {Math.min((rombel.totalSiswa / rombel.kapasitas) * 100, 100)}%"
								></div>
							</div>
						</div>
					</button>

					<!-- Actions -->
					<div class="flex gap-2.5 border-t border-slate-100 p-3">
						<button
							type="button"
							on:click={(e) => initiateDownload(e, rombel.id, rombel.namaRombel)}
							disabled={downloadingId === rombel.id}
							class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-emerald-300"
						>
							{#if downloadingId === rombel.id}
								<div
									class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
								></div>
								{#if isFetchingSubjects}Memuat...{:else}Mengunduh...{/if}
							{:else}
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								Template
							{/if}
						</button>
						<button
							type="button"
							on:click={(e) => promptDelete(e, rombel)}
							disabled={deletingId === rombel.id}
							class="flex items-center justify-center rounded-lg border-2 border-red-200 bg-red-50 px-3.5 py-2.5 text-red-500 transition-all duration-200 hover:border-red-400 hover:bg-red-500 hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
							aria-label="Hapus rombel {rombel.namaRombel}"
						>
							{#if deletingId === rombel.id}
								<div
									class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-500"
								></div>
							{:else}
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							{/if}
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Delete Confirmation Modal -->
<ModalAlert
	bind:show={showDeleteModal}
	type="warning"
	message="Yakin ingin menghapus {confirmDeleteRombel?.namaRombel ??
		''}? Siswa yang terdaftar akan dikeluarkan dari rombel ini."
	showCancel={true}
	confirmText="Hapus"
	cancelText="Batal"
	on:confirm={handleDelete}
	on:cancel={() => (confirmDeleteRombel = null)}
	on:close={() => (confirmDeleteRombel = null)}
/>

<!-- Subject Select Modal Component -->
<SubjectSelectModal
	isOpen={showSubjectModal}
	subjects={availableSubjects}
	rombelName={selectedRombelForDownload?.name || ''}
	on:close={() => {
		showSubjectModal = false;
		downloadingId = null;
	}}
	on:download={handleModalDownload}
/>
