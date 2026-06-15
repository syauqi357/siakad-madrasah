<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import ModalAlert from './modalalert.svelte';

	let showAlert = false;
	let alertMessage = '';

	export let show = false;
	export let studentName = '';
	export let studentNisn = '';
	export let isLoading = false;

	const dispatch = createEventDispatcher();

	// Form data
	let mutasiType = '';
	let reason = '';
	let destinationSchool = '';
	let completionDate = new Date().toISOString().split('T')[0]; // Default to today

	// Mutasi type options
	const mutasiTypes = [
		{ value: 'pindah_sekolah', label: 'Pindah Sekolah' },
		{ value: 'keluar', label: 'Keluar / Mengundurkan Diri' },
		{ value: 'dikeluarkan', label: 'Dikeluarkan' },
		{ value: 'meninggal', label: 'Meninggal Dunia' },
		{ value: 'lainnya', label: 'Lainnya' }
	];

	function resetForm() {
		mutasiType = '';
		reason = '';
		destinationSchool = '';
		completionDate = new Date().toISOString().split('T')[0];
	}

	function handleClose() {
		dispatch('close');
		resetForm();
	}

	function handleSubmit() {
		// Validation
		if (!mutasiType) {
			alertMessage = 'Jenis mutasi wajib dipilih';
			showAlert = true;
			return;
		}
		if (!reason.trim()) {
			alertMessage = 'Alasan mutasi wajib diisi';
			showAlert = true;
			return;
		}
		if (!completionDate) {
			alertMessage = 'Tanggal mutasi wajib diisi';
			showAlert = true;
			return;
		}

		dispatch('submit', {
			mutasiType,
			reason: reason.trim(),
			destinationSchool: destinationSchool.trim() || null,
			completionDate
		});
	}

	// Show destination school field only for "pindah_sekolah"
	$: showDestinationSchool = mutasiType === 'pindah_sekolah';
</script>

<Modal {show} title="Mutasi Siswa" subtitle={`${studentName} - ${studentNisn}`} size="lg" on:close={handleClose}>
	<form id="mutasiForm" on:submit|preventDefault={handleSubmit} class="space-y-4">
		<!-- Jenis Mutasi -->
		<div>
			<label for="mutasiType" class="mb-1 block text-sm font-medium">
				Jenis Mutasi <span class="text-red-500">*</span>
			</label>
			<select
				id="mutasiType"
				bind:value={mutasiType}
				class="w-full rounded-md border border-gray-400 px-3 py-2 transition-all ease-in-out focus:border-blue-500 focus:outline-none"
				required
			>
				<option value="" disabled>Pilih jenis mutasi</option>
				{#each mutasiTypes as type}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>

		<!-- Sekolah Tujuan (conditional) -->
		{#if showDestinationSchool}
			<div transition:fade={{ duration: 100 }}>
				<label for="destinationSchool" class="mb-1 block text-sm font-medium"> Sekolah Tujuan </label>
				<input
					type="text"
					id="destinationSchool"
					bind:value={destinationSchool}
					placeholder="Nama sekolah tujuan"
					class="w-full rounded-md border border-gray-400 px-3 py-2 transition-all ease-in-out focus:border-blue-500 focus:outline-none"
				/>
			</div>
		{/if}

		<!-- Tanggal Mutasi -->
		<div>
			<label for="completionDate" class="mb-1 block text-sm font-medium">
				Tanggal Mutasi <span class="text-red-500">*</span>
			</label>
			<input
				type="date"
				id="completionDate"
				bind:value={completionDate}
				class="w-full rounded-md border border-gray-400 px-3 py-2 transition-all ease-in-out focus:border-blue-500 focus:outline-none"
				required
			/>
		</div>

		<!-- Alasan Mutasi -->
		<div>
			<label for="reason" class="mb-1 block text-sm font-medium">
				Alasan Mutasi <span class="text-red-500">*</span>
			</label>
			<textarea
				id="reason"
				bind:value={reason}
				rows="3"
				placeholder="Jelaskan alasan mutasi siswa..."
				class="w-full resize-none rounded-md border border-gray-400 px-3 py-2 transition-all ease-in-out focus:border-blue-500 focus:outline-none"
				required
			></textarea>
		</div>
	</form>

	<svelte:fragment slot="footer">
		<button
			type="button"
			on:click={handleClose}
			class="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
			disabled={isLoading}
		>
			Batal
		</button>
		<button
			type="submit"
			form="mutasiForm"
			class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
			disabled={isLoading}
		>
			{#if isLoading}
				<span class="flex items-center gap-2">
					<span
						class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></span>
					Memproses...
				</span>
			{:else}
				Konfirmasi Mutasi
			{/if}
		</button>
	</svelte:fragment>
</Modal>

<ModalAlert bind:show={showAlert} type="warning" message={alertMessage} />
