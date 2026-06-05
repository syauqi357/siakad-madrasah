<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import UploadIcon from '$lib/components/icons/uploadIcon.svelte';
	import DownloadIcon from '$lib/components/icons/downloadIcon.svelte';

	export let isOpen = false;
	export let templateUrl = '';

	const dispatch = createEventDispatcher();

	let selectedFileName = '';
	let isDragging = false;
	let fileInput: HTMLInputElement;

	function close() {
		selectedFileName = '';
		isDragging = false;
		dispatch('close');
	}

	function isValidFile(file: File): boolean {
		const validTypes = [
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel'
		];
		const validExtensions = ['.xlsx', '.xls'];
		const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
		return validTypes.includes(file.type) || validExtensions.includes(ext);
	}

	function setFile(file: File) {
		if (!isValidFile(file)) {
			selectedFileName = '';
			return;
		}
		selectedFileName = file.name;
		// Sync file to the hidden input via DataTransfer
		const dt = new DataTransfer();
		dt.items.add(file);
		fileInput.files = dt.files;
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) selectedFileName = file.name;
	}

	function handleDragEnter(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		// Only set false if leaving the drop zone (not entering a child)
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const { clientX, clientY } = event;
		if (
			clientX <= rect.left ||
			clientX >= rect.right ||
			clientY <= rect.top ||
			clientY >= rect.bottom
		) {
			isDragging = false;
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		const file = event.dataTransfer?.files?.[0];
		if (file) setFile(file);
	}

	function handleUpload(event: SubmitEvent) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		dispatch('upload', formData);
		close();
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-1 flex items-center justify-center bg-gray-900/30 backdrop-blur-xs transition-all duration-75 ease-in-out"
		transition:fade={{ duration: 100 }}
	>
		<div
			class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
			transition:scale={{ duration: 150, start: 0.95 }}
		>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-bold text-slate-800">Upload Data Siswa</h2>
				<button
					on:click={close}
					aria-label="Close"
					class="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Step-by-step guide -->
			<div class="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
				<p class="mb-2 text-sm font-semibold text-amber-800">Cara Upload Data Siswa:</p>
				<ol class="list-inside list-decimal space-y-1 text-sm text-amber-700">
					<li><strong>Unduh template</strong> Excel terlebih dahulu</li>
					<li><strong>Isi data siswa</strong> pada template tersebut</li>
					<li><strong>Upload file</strong> template yang sudah diisi</li>
				</ol>
				{#if templateUrl}
					<a
						href={templateUrl}
						class="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
					>
						<DownloadIcon /> Unduh Template Excel
					</a>
				{/if}
			</div>

			<form on:submit|preventDefault={handleUpload} class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<label for="excel-file" class="text-sm font-medium text-slate-700">
						Upload file template yang sudah diisi
					</label>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="flex w-full items-center justify-center"
						on:dragenter={handleDragEnter}
						on:dragover={handleDragOver}
						on:dragleave={handleDragLeave}
						on:drop={handleDrop}
					>
						<label
							for="excel-file"
							class="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors
							{isDragging
								? 'border-blue-400 bg-blue-50'
								: selectedFileName
									? 'border-green-400 bg-green-50'
									: 'border-slate-300 bg-slate-50 hover:bg-slate-100'}"
						>
							<div class="flex flex-col items-center justify-center pt-4 pb-5">
								<div
									class="mb-2 {isDragging
										? 'text-blue-500'
										: selectedFileName
											? 'text-green-500'
											: 'text-slate-400'}"
								>
									<UploadIcon />
								</div>
								{#if isDragging}
									<p class="text-sm font-medium text-blue-600">Lepaskan file di sini...</p>
								{:else if selectedFileName}
									<p class="text-sm font-medium text-green-700">{selectedFileName}</p>
									<p class="text-xs text-green-600">Klik atau seret file untuk ganti</p>
								{:else}
									<p class="mb-1 text-sm text-slate-500">
										<span class="font-semibold">Klik untuk pilih file</span> atau seret ke sini
									</p>
									<p class="text-xs text-slate-400">Format: XLSX atau XLS (Maks. 10MB)</p>
								{/if}
							</div>
							<input
								id="excel-file"
								name="file"
								type="file"
								accept=".xlsx, .xls"
								class="hidden"
								bind:this={fileInput}
								on:change={handleFileSelect}
								required
							/>
						</label>
					</div>
				</div>

				<div class="flex justify-end gap-3">
					<button
						type="button"
						on:click={close}
						class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-4 focus:ring-slate-100 focus:outline-none"
					>
						Batal
					</button>
					<button
						type="submit"
						class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
					>
						<div class="text-white">
							<UploadIcon />
						</div>
						Upload
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
