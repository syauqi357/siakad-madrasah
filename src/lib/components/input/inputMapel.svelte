<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	let showAlert = false;
	let alertMessage = '';

	export let subject: {
		id?: number;
		name: string;
		subjectCode: string;
		description: string;
		kkm: number;
	} = {
		name: '',
		subjectCode: '',
		description: '',
		kkm: 75
	};

	export let isEditing = false;
	export let isLoading = false;

	const dispatch = createEventDispatcher();

	function handleSubmit() {
		if (!subject.name.trim()) {
			alertMessage = 'Nama mata pelajaran harus diisi';
			showAlert = true;
			return;
		}
		dispatch('submit', subject);
	}

	function handleCancel() {
		dispatch('cancel');
	}
</script>

<div class="w-full max-w-md space-y-8 rounded-xl border border-gray-300 bg-white p-5">
	<header class="text-left">
		<h2 class="text-xl font-bold text-gray-900 capitalize">
			{isEditing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
		</h2>
		<p class="mt-2 text-sm text-gray-600">Isi formulir mata pelajaran di bawah ini</p>
	</header>

	<form class="mt-6 space-y-6" on:submit|preventDefault={handleSubmit}>
		<div class="space-y-6">
			<!-- Subject Name -->
			<div class="relative w-full">
				<input
					type="text"
					id="subjectName"
					name="subjectName"
					placeholder=" "
					bind:value={subject.name}
					class="peer w-full rounded border border-gray-400 bg-transparent px-4 py-4 text-base text-gray-800 transition-all duration-200 outline-none placeholder-shown:py-4 hover:border-gray-600 focus:border-2 focus:border-blue-600 focus:px-[15px] focus:py-[15px]"
					required
				/>
				<label
					for="subjectName"
					class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
				>
					Nama Mata Pelajaran
				</label>
			</div>

			<!-- Subject Code -->
			<div class="relative w-full">
				<input
					type="text"
					id="subjectCode"
					name="subjectCode"
					placeholder=" "
					bind:value={subject.subjectCode}
					class="peer w-full rounded border border-gray-400 bg-transparent px-4 py-4 text-base text-gray-800 transition-all duration-200 outline-none placeholder-shown:py-4 hover:border-gray-600 focus:border-2 focus:border-blue-600 focus:px-[15px] focus:py-[15px]"
				/>
				<label
					for="subjectCode"
					class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
				>
					Kode Mata Pelajaran
				</label>
			</div>

			<!-- Description / Syllabus -->
			<div class="relative w-full">
				<textarea
					id="description"
					name="description"
					rows="3"
					placeholder=" "
					bind:value={subject.description}
					class="peer w-full rounded border border-gray-400 bg-transparent px-4 py-4 text-base text-gray-800 transition-all duration-200 outline-none hover:border-gray-600 focus:border-2 focus:border-blue-600 focus:px-[15px] focus:py-[15px]"
				></textarea>
				<label
					for="description"
					class="pointer-events-none absolute top-4 left-3 bg-white px-1 text-base text-gray-500 transition-all duration-200 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
				>
					Deskripsi / Silabus
				</label>
			</div>

			<!-- KKM -->
			<div class="relative w-full">
				<input
					type="number"
					id="kkm"
					name="kkm"
					min="0"
					max="100"
					placeholder=" "
					bind:value={subject.kkm}
					class="peer w-full [appearance:textfield] rounded border border-gray-400 bg-transparent px-4 py-4 text-base text-gray-800 transition-all duration-200 outline-none placeholder-shown:py-4 hover:border-gray-600 focus:border-2 focus:border-blue-600 focus:px-[15px] focus:py-[15px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					required
				/>
				<label
					for="kkm"
					class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
				>
					KKM
				</label>
			</div>
		</div>

		<div class="flex items-center justify-end gap-4 pt-4">
			<button
				type="button"
				on:click={handleCancel}
				class="rounded-md px-4 py-2 text-sm font-medium text-blue-600 transition-all ease-in-out hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Batal
			</button>
			<button
				type="submit"
				disabled={isLoading}
				class="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
			>
				{#if isLoading}
					<span class="flex items-center gap-2">
						<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Menyimpan...
					</span>
				{:else}
					{isEditing ? 'Perbarui' : 'Simpan'}
				{/if}
			</button>
		</div>
	</form>
</div>

<ModalAlert
	bind:show={showAlert}
	type="warning"
	message={alertMessage}
/>
