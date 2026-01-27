<script lang="ts">
	import { createEventDispatcher } from 'svelte';

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

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
			<h3 class="mb-4 text-lg font-bold text-gray-900">
				Pilih Mata Pelajaran
				{#if rombelName}
					- {rombelName}
				{/if}
			</h3>

			<div class="mb-6">
				<p class="mb-2 text-sm text-gray-600">
					Template Excel akan difilter berdasarkan mata pelajaran yang dipilih.
				</p>
				<label class="block text-sm font-medium text-gray-700" for="subject-select">
					Mata Pelajaran
				</label>
				<select
					id="subject-select"
					bind:value={selectedSubjectId}
					class="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
				>
					{#each subjects as subject}
						<option value={subject.id}>{subject.name}</option>
					{/each}
				</select>
			</div>

			<div class="flex justify-end gap-3">
				<button
					on:click={close}
					class="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
				>
					Batal
				</button>
				<button
					on:click={handleDownload}
					class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
				>
					Download Template
				</button>
			</div>
		</div>
	</div>
{/if}
