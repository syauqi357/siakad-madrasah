<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

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
</script>

<Modal
	{show}
	title={isEditing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
	size="md"
	on:close={close}
>
	<form id="subjectForm" on:submit|preventDefault={handleSubmit} class="space-y-4">
		{#if error}
			<div class="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
		{/if}

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
	</form>

	<svelte:fragment slot="footer">
		<button
			type="button"
			on:click={close}
			class="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
		>
			Batal
		</button>
		<button
			type="submit"
			form="subjectForm"
			disabled={loading}
			class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
		>
			{loading ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
		</button>
	</svelte:fragment>
</Modal>
