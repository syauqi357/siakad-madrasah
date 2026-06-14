<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let show = false;
	export let isEditing = false;
	export let data = {
		id: 0,
		name: '',
		subjectCode: '',
		description: '',
		kkm: 75
	};
	export let error = '';
	export let loading = false;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleSubmit() {
		dispatch('submit', data);
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			close();
		}
	}
</script>

{#if show}
	<div
		class="fixed inset-0 z-2 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		role="dialog"
		tabindex="-1"
		aria-modal="true"
	>
		<div
			class="w-full max-w-md rounded-lg border border-slate-400 bg-white shadow-sm"
			transition:fly={{ y: 20, duration: 200 }}
		>
			<div class="flex items-center justify-between border-b border-slate-400 px-6 py-4">
				<h2 class="text-lg font-semibold text-gray-900">
					{isEditing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
				</h2>
				<button aria-label="close" on:click={close} class="text-gray-400 hover:text-gray-600">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="p-6">
				{#if error}
					<div class="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
				{/if}

				<div class="space-y-4">
					<div>
						<label for="subjectName" class="mb-1 block text-sm font-medium text-gray-700">
							Nama Mata Pelajaran <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="subjectName"
							bind:value={data.name}
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							placeholder="masukkan mata pelajaran"
							required
						/>
					</div>

					<div>
						<label for="subjectCode" class="mb-1 block text-sm font-medium text-gray-700">
							Kode Mata Pelajaran
						</label>
						<input
							type="text"
							id="subjectCode"
							bind:value={data.subjectCode}
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							placeholder="masukkan kode mapel"
						/>
					</div>

					<div>
						<label for="kkm" class="mb-1 block text-sm font-medium text-gray-700">KKM</label>
						<input
							type="number"
							id="kkm"
							bind:value={data.kkm}
							min="0"
							max="100"
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							placeholder="masukkan KKM"
						/>
					</div>

					<div>
						<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
							Deskripsi
						</label>
						<textarea
							id="description"
							bind:value={data.description}
							rows="3"
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							placeholder="Deskripsi mata pelajaran..."
						></textarea>
					</div>
				</div>

				<div class="mt-6 flex justify-end gap-3">
					<button
						type="button"
						on:click={close}
						class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={loading}
						class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{loading ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
