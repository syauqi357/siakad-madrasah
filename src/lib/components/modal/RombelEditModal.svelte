<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	export let show = false;
	export let isSaving = false;
	export let activeCount = 0;
	export let editData = {
		nama_rombel: '',
		tingkat_kelas: 0,
		wali_kelas: null as number | null,
		nama_ruangan: '',
		student_capacity: 32,
		kurikulum: ''
	};
	export let classesDropdown: { id: number; name: string }[] = [];
	export let teachersDropdown: { id: number; name: string }[] = [];
	export let curriculumDropdown: { id: number; name: string }[] = [];

	const dispatch = createEventDispatcher<{
		close: void;
		submit: typeof editData;
	}>();

	function handleClose() {
		dispatch('close');
	}

	function handleSubmit() {
		dispatch('submit', editData);
	}
</script>

<Modal
	{show}
	title="Edit Rombongan Belajar"
	subtitle="Perbarui informasi rombel dan kapasitas"
	size="lg"
	on:close={handleClose}
>
	<form id="rombelEditForm" on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="col-span-2 space-y-1.5">
				<label for="nama_rombel" class="text-xs font-semibold text-slate-500 uppercase"
					>Nama Rombel</label
				>
				<input
					id="nama_rombel"
					type="text"
					bind:value={editData.nama_rombel}
					required
					class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
				/>
			</div>

			<div class="space-y-1.5">
				<label for="tingkat" class="text-xs font-semibold text-slate-500 uppercase"
					>Tingkat Kelas</label
				>
				<select
					id="tingkat"
					bind:value={editData.tingkat_kelas}
					required
					class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
				>
					<option value={0} disabled>Pilih Tingkat</option>
					{#each classesDropdown as item}
						<option value={item.id}>{item.name}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-1.5">
				<label for="kapasitas" class="text-xs font-semibold text-slate-500 uppercase"
					>Kapasitas</label
				>
				<input
					id="kapasitas"
					type="number"
					bind:value={editData.student_capacity}
					min={activeCount}
					required
					class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
				/>
			</div>

			<div class="col-span-2 space-y-1.5">
				<label for="wali" class="text-xs font-semibold text-slate-500 uppercase">Wali Kelas</label>
				<select
					id="wali"
					bind:value={editData.wali_kelas}
					class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
				>
					<option value={null}>Belum ada Wali Kelas</option>
					{#each teachersDropdown as item}
						<option value={item.id}>{item.name}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-1.5">
				<label for="ruangan" class="text-xs font-semibold text-slate-500 uppercase">Ruangan</label>
				<input
					id="ruangan"
					type="text"
					bind:value={editData.nama_ruangan}
					class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
				/>
			</div>

			<div class="space-y-1.5">
				<label for="kurikulum" class="text-xs font-semibold text-slate-500 uppercase"
					>Kurikulum</label
				>
				<select
					id="kurikulum"
					bind:value={editData.kurikulum}
					class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
				>
					<option value="">Pilih Kurikulum</option>
					{#each curriculumDropdown as item}
						<option value={item.name}>{item.name}</option>
					{/each}
				</select>
			</div>
		</div>
	</form>

	<svelte:fragment slot="footer">
		<button
			type="button"
			on:click={handleClose}
			class="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
		>
			Batal
		</button>
		<button
			type="submit"
			form="rombelEditForm"
			disabled={isSaving}
			class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isSaving}
				<span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
				></span>
				Menyimpan...
			{:else}
				Simpan Perubahan
			{/if}
		</button>
	</svelte:fragment>
</Modal>
