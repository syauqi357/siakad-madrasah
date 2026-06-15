<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

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
</script>

<Modal
	{show}
	title={isEditing ? 'Edit Jenis Penilaian' : 'Tambah Jenis Penilaian'}
	size="sm"
	on:close={handleClose}
>
	<form id="examForm" on:submit|preventDefault={handleSubmit} class="space-y-4">
		{#if error}
			<div class="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
		{/if}

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
	</form>

	<svelte:fragment slot="footer">
		<button
			type="button"
			on:click={handleClose}
			class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
		>
			Batal
		</button>
		<button
			type="submit"
			form="examForm"
			disabled={loading}
			class="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
		>
			{loading ? 'Menyimpan...' : 'Simpan'}
		</button>
	</svelte:fragment>
</Modal>
