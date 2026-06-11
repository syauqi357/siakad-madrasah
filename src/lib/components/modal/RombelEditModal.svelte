<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';

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

{#if show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
	>
		<!-- Backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
			on:click={handleClose}
		></div>

		<!-- Modal Panel -->
		<div
			class="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
			transition:fly={{ y: 20, duration: 250 }}
		>
			<div class="border-b border-slate-100 px-6 py-4">
				<h3 class="text-lg font-bold text-slate-800">Edit Rombongan Belajar</h3>
				<p class="text-xs text-slate-400">Perbarui informasi rombel dan kapasitas</p>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="space-y-4 p-6">
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
							class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
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
							class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
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
							class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
						/>
					</div>

					<div class="col-span-2 space-y-1.5">
						<label for="wali" class="text-xs font-semibold text-slate-500 uppercase"
							>Wali Kelas</label
						>
						<select
							id="wali"
							bind:value={editData.wali_kelas}
							class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
						>
							<option value={null}>Belum ada Wali Kelas</option>
							{#each teachersDropdown as item}
								<option value={item.id}>{item.name}</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1.5">
						<label for="ruangan" class="text-xs font-semibold text-slate-500 uppercase"
							>Ruangan</label
						>
						<input
							id="ruangan"
							type="text"
							bind:value={editData.nama_ruangan}
							class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
						/>
					</div>

					<div class="space-y-1.5">
						<label for="kurikulum" class="text-xs font-semibold text-slate-500 uppercase"
							>Kurikulum</label
						>
						<select
							id="kurikulum"
							bind:value={editData.kurikulum}
							class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
						>
							<option value="">Pilih Kurikulum</option>
							{#each curriculumDropdown as item}
								<option value={item.name}>{item.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="flex items-center gap-3 pt-4">
					<button
						type="button"
						on:click={handleClose}
						class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSaving}
						class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
					>
						{#if isSaving}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></div>
							Menyimpan...
						{:else}
							Simpan Perubahan
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
