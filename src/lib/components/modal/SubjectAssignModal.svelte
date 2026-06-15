<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	export let show = false;
	export let isEditing = false;
	export let data = {
		id: 0,
		classId: 0,
		subjectId: 0,
		teacherId: null as number | null
	};
	export let error = '';
	export let loading = false;
	export let classesDropdown: any[] = [];
	export let unassignedSubjects: any[] = [];
	export let subjectsDropdown: any[] = [];
	export let teachersDropdown: any[] = [];

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
	title={isEditing ? 'Ubah Guru Pengampu' : 'Tambah Mapel ke Kelas'}
	size="md"
	on:close={close}
>
	<form id="assignForm" on:submit|preventDefault={handleSubmit} class="space-y-4">
		{#if error}
			<div class="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
		{/if}

		<div class="rounded-md bg-blue-50 px-4 py-3">
			<p class="text-xs font-medium tracking-wide text-blue-500 uppercase">Kelas</p>
			<p class="mt-0.5 text-xl font-bold text-blue-700">
				{classesDropdown.find((c) => c.id === data.classId)?.name || '-'}
			</p>
		</div>

		{#if !isEditing}
			<div>
				<label for="assignSubject" class="mb-1 block text-sm font-medium text-gray-700">
					Mata Pelajaran <span class="text-red-500">*</span>
				</label>
				<select
					id="assignSubject"
					bind:value={data.subjectId}
					class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
					required
				>
					<option value={0}>-- Pilih Mata Pelajaran --</option>
					{#each unassignedSubjects as subj (subj.id)}
						<option value={subj.id}>{subj.name} {subj.code ? `(${subj.code})` : ''}</option>
					{/each}
				</select>
				{#if unassignedSubjects.length === 0}
					<p class="mt-1 text-xs text-gray-500">
						Semua mata pelajaran sudah ditugaskan ke kelas ini
					</p>
				{/if}
			</div>
		{:else}
			<div>
				<label for="assignSubjectRO" class="mb-1 block text-sm font-medium text-gray-700"
					>Mata Pelajaran</label
				>
				<input
					type="text"
					id="assignSubjectRO"
					value={subjectsDropdown.find((s) => s.id === data.subjectId)?.name || ''}
					class="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
					readonly
				/>
			</div>
		{/if}

		<div>
			<label for="assignTeacher" class="mb-1 block text-sm font-medium text-gray-700"
				>Guru Pengampu</label
			>
			<select
				id="assignTeacher"
				bind:value={data.teacherId}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			>
				<option value={null}>-- Belum Ditugaskan --</option>
				{#each teachersDropdown as teacher (teacher.id)}
					<option value={teacher.id}>{teacher.name}</option>
				{/each}
			</select>
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
			form="assignForm"
			disabled={loading || (!isEditing && data.subjectId === 0)}
			class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
		>
			{loading ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
		</button>
	</svelte:fragment>
</Modal>
