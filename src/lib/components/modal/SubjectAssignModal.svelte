<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

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

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			close();
		}
	}
</script>

{#if show}
	<div
		class="fixed inset-0 z-20 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		role="dialog"
		tabindex="-1"
		aria-modal="true"
	>
		<div
			class="w-full max-w-md rounded-lg bg-white shadow-lg"
			transition:fly={{ y: 20, duration: 200 }}
		>
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="text-lg font-semibold text-gray-900">
					{isEditing ? 'Ubah Guru Pengampu' : 'Tambah Mapel ke Kelas'}
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
					<!-- Class (read-only when adding) -->
					<div>
						<label for="assignClass" class="mb-1 block text-sm font-medium text-gray-700">
							Kelas
						</label>
						<input
							type="text"
							id="assignClass"
							value={classesDropdown.find((c) => c.id === data.classId)?.name || ''}
							class="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
							readonly
						/>
					</div>

					<!-- Subject (only when adding) -->
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
							<label for="assignSubjectRO" class="mb-1 block text-sm font-medium text-gray-700">
								Mata Pelajaran
							</label>
							<input
								type="text"
								id="assignSubjectRO"
								value={subjectsDropdown.find((s) => s.id === data.subjectId)?.name || ''}
								class="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
								readonly
							/>
						</div>
					{/if}

					<!-- Teacher -->
					<div>
						<label for="assignTeacher" class="mb-1 block text-sm font-medium text-gray-700">
							Guru Pengampu
						</label>
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
						disabled={loading || (!isEditing && data.subjectId === 0)}
						class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{loading ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
