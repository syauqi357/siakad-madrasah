<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	interface ModalExamProps {
		show: boolean;
		isEditing: boolean;
		data: { code: string; name: string; defaultWeight: string };
		error: string;
		loading: boolean;
	}

	export let show: ModalExamProps['show'] = false;
	export let isEditing: ModalExamProps['isEditing'] = false;
	export let data: ModalExamProps['data'] = { code: '', name: '', defaultWeight: '' };
	export let error: ModalExamProps['error'] = '';
	export let loading: ModalExamProps['loading'] = false;

	const dispatch = createEventDispatcher();

	function handleSubmit() {
		dispatch('submit', data);
	}

	function handleClose() {
		dispatch('close');
		show = false;
	}

	function handleBackdropClick(mouseEvent: MouseEvent) {
		if (mouseEvent.target === mouseEvent.currentTarget) {
			handleClose();
		}
	}
</script>

{#if show}
	<div
		class="fixed inset-0 z-2 flex items-center justify-center bg-black/20 p-4 backdrop-blur-xs"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		on:keydown={(keyboardEvent) => keyboardEvent.key === 'Escape' && handleClose()}
		tabindex="-1"
		role="presentation"
	>
		<div
			class="w-full max-w-md rounded-lg bg-white shadow-xl"
			transition:scale={{ duration: 150, start: 0.95 }}
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<h3 id="modal-title" class="text-lg font-semibold text-slate-900">
					{isEditing ? 'Edit Jenis Penilaian' : 'Tambah Jenis Penilaian'}
				</h3>
				<button
					on:click={handleClose}
					class="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
					aria-label="Tutup modal"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="p-6">
				{#if error}
					<div class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				{/if}

				<div class="space-y-4">
					<div>
						<label for="code" class="mb-1 block text-sm font-medium text-slate-700">
							Kode Penilaian <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="code"
							bind:value={data.code}
							class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							placeholder="PRAKTIK"
							required
						/>
						<p class="mt-1 text-xs text-slate-500">Contoh: TUGAS, UH, UTS, UAS</p>
					</div>

					<div>
						<label for="name" class="mb-1 block text-sm font-medium text-slate-700">
							Nama Penilaian <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							bind:value={data.name}
							class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							placeholder="Penilaian Praktik"
							required
						/>
					</div>

					<div>
						<label for="weight" class="mb-1 block text-sm font-medium text-slate-700">
							Bobot Default (%)
						</label>
						<input
							type="number"
							id="weight"
							bind:value={data.defaultWeight}
							min="0"
							max="100"
							class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							placeholder="15"
						/>
						<p class="mt-1 text-xs text-slate-500">Opsional. Bisa diatur per kelas/mapel.</p>
					</div>
				</div>

				<div class="mt-6 flex justify-end gap-3">
					<button
						type="button"
						on:click={handleClose}
						class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={loading}
						class="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? 'Menyimpan...' : 'Simpan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
