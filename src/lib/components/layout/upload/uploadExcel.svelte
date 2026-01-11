<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import UploadIcon from '$lib/components/icons/uploadIcon.svelte';

	export let isOpen = false;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleUpload(event: SubmitEvent) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		dispatch('upload', formData);
		close();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-1 flex items-center justify-center bg-gray-900/50 transition-all ease-in-out backdrop-blur-sm">
		<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-slate-800">Upload Data Siswa</h2>
				<button on:click={close} aria-label="Close" class="rounded-full p-1 hover:bg-slate-100 text-slate-500  transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<form on:submit|preventDefault={handleUpload} class="flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<label for="excel-file" class="text-sm font-medium text-slate-700">
						Pilih File Excel (.xlsx, .xls)
					</label>
					<div class="flex w-full items-center justify-center">
						<label
							for="excel-file"
							class="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors"
						>
							<div class="flex flex-col items-center justify-center pb-6 pt-5">
								<div class="mb-2 text-slate-400">
									<UploadIcon />
								</div>
								<p class="mb-2 text-sm text-slate-500"><span class="font-semibold">Klik untuk upload</span> atau drag and drop</p>
								<p class="text-xs text-slate-500">XLSX, XLS (MAX. 10MB)</p>
							</div>
							<input id="excel-file" name="file" type="file" accept=".xlsx, .xls" class="hidden" required />
						</label>
					</div>
				</div>

				<div class="flex justify-end gap-3">
					<button
						type="button"
						on:click={close}
						class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
					>
						Batal
					</button>
					<button
						type="submit"
						class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
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
