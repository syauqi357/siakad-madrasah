<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { API_FETCH } from '$lib/api';

	export let show = false;
	export let rombelId: string | number;
	export let availableSlots = 0;

	const dispatch = createEventDispatcher<{
		close: void;
		success: string;
	}>();

	let unassignedStudents: { id: number; name: string; nisn: string }[] = [];
	let selectedNewStudents: number[] = [];
	let addSearchQuery = '';
	let loadingUnassigned = false;
	let isSaving = false;

	$: filteredUnassigned = unassignedStudents.filter((s) => {
		if (!addSearchQuery) return true;
		const q = addSearchQuery.toLowerCase();
		return s.name.toLowerCase().includes(q) || s.nisn.includes(addSearchQuery);
	});

	$: isSlotsFull = selectedNewStudents.length >= availableSlots;

	$: allUnassignedSelected =
		filteredUnassigned.length > 0 &&
		filteredUnassigned.every((s) => selectedNewStudents.includes(s.id));

	async function fetchUnassignedStudents() {
		loadingUnassigned = true;
		try {
			const response = await API_FETCH('/routes/api/studentDataSet/lite');
			if (response.ok) {
				const data = await response.json();
				unassignedStudents = data.data || data;
			}
		} catch (err) {
			console.error('Error fetching unassigned students:', err);
		} finally {
			loadingUnassigned = false;
		}
	}

	$: if (show) {
		fetchUnassignedStudents();
		selectedNewStudents = [];
		addSearchQuery = '';
	}

	function handleClose() {
		dispatch('close');
	}

	function toggleNewStudent(id: number) {
		if (selectedNewStudents.includes(id)) {
			selectedNewStudents = selectedNewStudents.filter((s) => s !== id);
		} else if (selectedNewStudents.length < availableSlots) {
			selectedNewStudents = [...selectedNewStudents, id];
		}
	}

	function toggleAllUnassigned() {
		if (allUnassignedSelected) {
			selectedNewStudents = selectedNewStudents.filter(
				(id) => !filteredUnassigned.some((s) => s.id === id)
			);
		} else {
			const toAdd = filteredUnassigned
				.filter((s) => !selectedNewStudents.includes(s.id))
				.slice(0, availableSlots - selectedNewStudents.length)
				.map((s) => s.id);
			selectedNewStudents = [...selectedNewStudents, ...toAdd];
		}
	}

	async function saveNewStudents() {
		if (selectedNewStudents.length === 0) return;

		isSaving = true;
		try {
			const response = await API_FETCH(`/routes/api/rombel/${rombelId}/students`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ studentIds: selectedNewStudents })
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal menambahkan siswa');
			}

			dispatch('success', result.message);
			handleClose();
		} catch (err) {
			console.error('Error saving students:', err);
			// We could dispatch an error event too, but simple alert might suffice for now
			// Or let the parent handle it via a result prop if needed.
		} finally {
			isSaving = false;
		}
	}
</script>

{#if show}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 flex justify-end" transition:fade={{ duration: 150 }}>
		<!-- Backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" on:click={handleClose}></div>

		<!-- Panel -->
		<div
			class="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
			transition:fly={{ x: 500, duration: 250 }}
		>
			<!-- Panel Header -->
			<div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<div>
					<h2 class="text-lg font-bold text-slate-800">Tambah Siswa</h2>
					<p class="text-xs text-slate-400">
						Siswa yang belum memiliki rombel
						{#if availableSlots > 0}
							— <span class="font-medium text-blue-600">{availableSlots} slot tersisa</span>
						{/if}
					</p>
				</div>
				<button
					aria-label="close"
					on:click={handleClose}
					class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Search -->
			<div class="border-b border-slate-100 px-6 py-3">
				<div class="relative">
					<svg
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						placeholder="Cari nama atau NISN..."
						bind:value={addSearchQuery}
						class="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Select All Bar -->
			{#if filteredUnassigned.length > 0}
				<div
					class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-2"
				>
					<label class="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-500">
						<input
							type="checkbox"
							checked={allUnassignedSelected}
							on:change={toggleAllUnassigned}
							class="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
						/>
						Pilih Semua
					</label>
					<span class="text-xs font-medium text-slate-400">
						{selectedNewStudents.length} dipilih
					</span>
				</div>
			{/if}

			<!-- Capacity Warning -->
			{#if isSlotsFull && availableSlots > 0}
				<div
					class="border-b border-amber-200 bg-amber-50 px-6 py-2 text-xs font-medium text-amber-700"
				>
					Slot penuh — {selectedNewStudents.length}/{availableSlots} terpilih
				</div>
			{/if}

			{#if availableSlots <= 0}
				<div class="border-b border-red-200 bg-red-50 px-6 py-2 text-xs font-medium text-red-600">
					Kapasitas rombel sudah penuh
				</div>
			{/if}

			<!-- Student List -->
			<div class="flex-1 overflow-y-auto">
				{#if loadingUnassigned}
					<div class="flex flex-col items-center justify-center py-16">
						<div
							class="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
						></div>
						<span class="mt-3 text-sm text-slate-400">Memuat data siswa...</span>
					</div>
				{:else if filteredUnassigned.length === 0}
					<div class="flex flex-col items-center justify-center py-16">
						<svg
							class="mb-2 h-10 w-10 text-slate-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<p class="text-sm font-medium text-slate-500">
							{addSearchQuery ? 'Tidak ditemukan' : 'Semua siswa sudah memiliki rombel'}
						</p>
					</div>
				{:else}
					<div class="divide-y divide-slate-50">
						{#each filteredUnassigned as student (student.id)}
							{@const isChecked = selectedNewStudents.includes(student.id)}
							{@const isDisabled = !isChecked && isSlotsFull}
							<label
								class="flex cursor-pointer items-center gap-3.5 px-6 py-3 transition-colors
									{isChecked ? 'bg-blue-50/60' : isDisabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-slate-50'}"
							>
								<input
									type="checkbox"
									checked={isChecked}
									disabled={isDisabled}
									on:change={() => toggleNewStudent(student.id)}
									class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
								/>
								<span class="flex-1">
									<span class="text-sm font-medium text-slate-800 capitalize">{student.name}</span>
									<span class="font-mono text-xs text-slate-400">{student.nisn}</span>
								</span>
							</label>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Panel Footer -->
			<div class="border-t border-slate-200 bg-slate-50/30 px-6 py-4">
				<div class="flex items-center gap-3">
					<button
						on:click={handleClose}
						class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
					>
						Batal
					</button>
					<button
						on:click={saveNewStudents}
						disabled={selectedNewStudents.length === 0 || isSaving}
						class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all
							{selectedNewStudents.length > 0 && !isSaving
							? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md'
							: 'cursor-not-allowed bg-slate-100 text-slate-400'}"
					>
						{#if isSaving}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></div>
							Menyimpan...
						{:else}
							Tambahkan {selectedNewStudents.length} Siswa
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
