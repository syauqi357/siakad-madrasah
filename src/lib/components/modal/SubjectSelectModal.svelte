<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	export let isOpen = false;
	export let subjects: { id: number; name: string }[] = [];
	export let rombelName = ''; // For display purposes if needed

	const dispatch = createEventDispatcher();
	let selectedSubjectId: number | null = null;

	// Reset selection when modal opens or subjects change
	$: if (isOpen && subjects.length > 0 && !selectedSubjectId) {
		selectedSubjectId = subjects[0].id;
	}

	function close() {
		dispatch('close');
	}

	function handleDownload() {
		if (selectedSubjectId) {
			dispatch('download', { subjectId: selectedSubjectId });
		}
	}
</script>

<Modal
	show={isOpen}
	title={rombelName ? `Pilih Mata Pelajaran - ${rombelName}` : 'Pilih Mata Pelajaran'}
	size="md"
	on:close={close}
>
	<p class="mb-2 text-sm text-gray-600">
		Template Excel akan difilter berdasarkan mata pelajaran yang dipilih.
	</p>
	<label class="block text-sm font-medium text-gray-700" for="subject-select"> Mata Pelajaran </label>
	<select
		id="subject-select"
		bind:value={selectedSubjectId}
		class="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
	>
		{#each subjects as subject}
			<option value={subject.id}>{subject.name}</option>
		{/each}
	</select>

	<svelte:fragment slot="footer">
		<button
			on:click={close}
			class="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
		>
			Batal
		</button>
		<button
			on:click={handleDownload}
			class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
		>
			Download Template
		</button>
	</svelte:fragment>
</Modal>
