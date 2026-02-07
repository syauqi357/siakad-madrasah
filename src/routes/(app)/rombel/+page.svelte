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

<div class="p-4">
	<div>
		<button
			on:click={addrombel}
			class="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 font-medium text-blue-50 capitalize"
		>
			<AddIcon /> add rombel
		</button>
	</div>
</div>
<div class="min-h-100 p-4">
	<span class="mb-4 block text-2xl font-bold capitalize">rombongan belajar</span>

	<!-- Loading State -->
	{#if isLoading}
		<div class="flex items-center justify-center py-12">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
			></div>
			<span class="ml-3 text-gray-600">Memuat data...</span>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<div class="mb-4 text-red-500">
				<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>
			<p class="mb-4 text-gray-600">{error}</p>
			<button
				on:click={fetchRombelData}
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			>
				Coba Lagi
			</button>
		</div>
	{:else if rombelData.length === 0}
		<!-- Empty State -->
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<div class="mb-4 text-gray-400">
				<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
			</div>
			<p class="text-gray-600">Belum ada data rombongan belajar</p>
		</div>
	{:else}
		<!-- Grid Container -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5">
			{#each rombelData as rombel}
				<!-- Card Container -->
				<div
					class="flex aspect-square w-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 text-left transition-all ease-in-out hover:shadow-lg"
				>
					<!-- Clickable Card Content -->
					<button
						type="button"
						on:click={() => detailrombel(rombel.id)}
						class="flex flex-1 cursor-pointer flex-col justify-between text-left"
					>
						<!-- Top Section -->
						<div class="flex w-full items-start justify-between">
							<div>
								<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
									Nama Rombel
								</div>
								<div class="text-2xl font-bold text-gray-800">{rombel.namaRombel}</div>
							</div>
							<div class="text-right">
								<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
									Tingkat
								</div>
								<div class="text-xl font-bold text-gray-800">{rombel.tingkat || '-'}</div>
							</div>
						</div>

						<!-- Middle Section -->
						<div class="flex w-full flex-col gap-4">
							<div>
								<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
									Wali Kelas
								</div>
								<div class="font-bold break-all text-gray-900 uppercase">
									{rombel.waliKelas || '-'}
								</div>
							</div>

							<div class="grid grid-cols-2 gap-2">
								<div>
									<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
										Ruangan
									</div>
									<div class="my-2 w-fit rounded-sm bg-blue-500 px-3 py-1 text-sm text-blue-50">
										{rombel.ruangan || '-'}
									</div>
								</div>
								<div>
									<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
										Kurikulum
									</div>
									<div class="my-2 w-fit rounded-sm bg-blue-500 px-3 py-1 text-sm text-blue-50">
										{rombel.kurikulum}
									</div>
								</div>
							</div>
						</div>

						<!-- Student Count -->
						<div class="w-full border-t border-gray-100 pt-3">
							<div class="flex items-end justify-between">
								<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
									Total Siswa
								</div>
								<div class="text-xl font-bold text-gray-800">
									{rombel.totalSiswa}
									<span class="text-sm font-normal text-gray-400">/ {rombel.kapasitas}</span>
								</div>
							</div>
							<!-- Simple progress bar -->
							<div class="mt-2 h-1.5 w-full rounded-full bg-gray-100">
								<div
									class="h-1.5 rounded-full bg-blue-600"
									style="width: {(rombel.totalSiswa / rombel.kapasitas) * 100}%"
								></div>
							</div>
						</div>
					</button>

					<!-- Action Buttons -->
					<div class="mt-3 flex gap-2">
						<button
							type="button"
							on:click={(e) => initiateDownload(e, rombel.id, rombel.namaRombel)}
							disabled={downloadingId === rombel.id}
							class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
						>
							{#if downloadingId === rombel.id}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
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
								Download
							{/if}
						</button>
						<button
							type="button"
							on:click={(e) => promptDelete(e, rombel)}
							disabled={deletingId === rombel.id}
							class="flex cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
							aria-label="Hapus rombel {rombel.namaRombel}"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
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
	message="Yakin ingin menghapus {confirmDeleteRombel?.namaRombel ?? ''}? Siswa yang terdaftar akan dikeluarkan dari rombel ini."
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
