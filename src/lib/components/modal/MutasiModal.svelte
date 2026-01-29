<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

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
			alert('Jenis mutasi wajib dipilih');
			return;
		}
		if (!reason.trim()) {
			alert('Alasan mutasi wajib diisi');
			return;
		}
		if (!completionDate) {
			alert('Tanggal mutasi wajib diisi');
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

{#if show}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		transition:fade={{ duration: 150 }}
		on:click={handleClose}
		on:keydown={(e) => e.key === 'Escape' && handleClose()}
		tabindex="-1"
		role="presentation"
	>
		<!-- Modal -->
		<div
			class="w-full max-w-lg rounded-lg border bg-white shadow-xl"
			transition:scale={{ duration: 150, start: 0.95 }}
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b px-6 py-4">
				<div>
					<h2 id="modal-title" class="text-lg font-bold">Mutasi Siswa</h2>
					<p class="text-sm opacity-70">{studentName} - {studentNisn}</p>
				</div>
				<button
					on:click={handleClose}
					class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
					aria-label="Close"
				>
					&#10005;
				</button>
			</div>

			<!-- Form -->
			<form on:submit|preventDefault={handleSubmit} class="space-y-4 p-6">
				<!-- Jenis Mutasi -->
				<div>
					<label for="mutasiType" class="mb-1 block text-sm font-medium">
						Jenis Mutasi <span class="text-red-500">*</span>
					</label>
					<select
						id="mutasiType"
						bind:value={mutasiType}
						class="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
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
						<label for="destinationSchool" class="mb-1 block text-sm font-medium">
							Sekolah Tujuan
						</label>
						<input
							type="text"
							id="destinationSchool"
							bind:value={destinationSchool}
							placeholder="Nama sekolah tujuan"
							class="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
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
						class="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
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
						class="w-full resize-none rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
						required
					></textarea>
				</div>

				<!-- Actions -->
				<div class="flex justify-end gap-3 border-t pt-4">
					<button
						type="button"
						on:click={handleClose}
						class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
						disabled={isLoading}
					>
						Batal
					</button>
					<button
						type="submit"
						class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
						disabled={isLoading}
					>
						{#if isLoading}
							<span class="flex items-center gap-2">
								<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
								Memproses...
							</span>
						{:else}
							Konfirmasi Mutasi
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}