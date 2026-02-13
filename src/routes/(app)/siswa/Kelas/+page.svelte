<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import AddIcon from '$lib/components/icons/addIcon.svelte';
	import { API_FETCH } from '$lib/api';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	interface ClassData {
		id: number;
		className: string;
	}

	let classes: ClassData[] = [];
	let isLoading = false;
	let isSubmitting = false;
	let showModal = false;
	let isEditing = false;
	let currentClass: ClassData = {
		id: 0,
		className: ''
	};
	let error = '';

	// Alert state
	let showAlert = false;
	let alertType: 'success' | 'error' | 'warning' | 'info' = 'success';
	let alertMessage = '';
	let alertShowCancel = false;
	let alertConfirmText = 'OK';
	let pendingDeleteClass: ClassData | null = null;

	const emptyClass: ClassData = {
		id: 0,
		className: ''
	};

	onMount(async () => {
		await fetchClasses();
	});

	async function fetchClasses() {
		isLoading = true;
		error = '';
		try {
			const response = await API_FETCH('/routes/api/class-data/classes');
			const data = await response.json();
			if (data.success) {
				classes = data.data;
			} else {
				showAlertModal('error', data.message || 'Gagal memuat data');
			}
		} catch (err) {
			showAlertModal('error', 'Gagal terhubung ke server');
			console.error('Error fetching classes:', err);
		} finally {
			isLoading = false;
		}
	}

	function handleAddClick() {
		currentClass = { ...emptyClass };
		isEditing = false;
		showModal = true;
	}

	function handleEditClick(classData: ClassData) {
		currentClass = { ...classData };
		isEditing = true;
		showModal = true;
	}

	function handleCloseModal() {
		showModal = false;
		currentClass = { ...emptyClass };
		isEditing = false;
		error = '';
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleCloseModal();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showModal) {
			handleCloseModal();
		}
	}

	async function handleSubmit() {
		if (!currentClass.className.trim()) {
			error = 'Nama kelas harus diisi';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			let response;
			if (isEditing && currentClass.id) {
				response = await API_FETCH(`/routes/api/class-data/classes/${currentClass.id}`, {
					method: 'PUT',
					body: JSON.stringify({
						className: currentClass.className
					})
				});
			} else {
				response = await API_FETCH('/routes/api/class-data/classes', {
					method: 'POST',
					body: JSON.stringify({
						className: currentClass.className
					})
				});
			}

			const data = await response.json();
			if (data.success) {
				const action = isEditing ? 'diperbarui' : 'ditambahkan';
				await fetchClasses();
				handleCloseModal();
				showAlertModal('success', `Kelas "${currentClass.className}" berhasil ${action}`);
			} else {
				error = data.message || 'Gagal menyimpan data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error saving class:', err);
		} finally {
			isSubmitting = false;
		}
	}

	function showAlertModal(
		type: typeof alertType,
		message: string,
		showCancel = false,
		confirmText = 'OK'
	) {
		alertType = type;
		alertMessage = message;
		alertShowCancel = showCancel;
		alertConfirmText = confirmText;
		showAlert = true;
	}

	function handleDeleteClick(classData: ClassData) {
		pendingDeleteClass = classData;
		showAlertModal(
			'warning',
			`Apakah Anda yakin ingin menghapus kelas "${classData.className}"?`,
			true,
			'Hapus'
		);
	}

	async function confirmDelete() {
		if (!pendingDeleteClass) return;

		isLoading = true;

		try {
			const response = await API_FETCH(`/routes/api/class-data/classes/${pendingDeleteClass.id}`, {
				method: 'DELETE'
			});

			const data = await response.json();
			if (data.success) {
				await fetchClasses();
				showAlertModal('success', `Kelas "${pendingDeleteClass.className}" berhasil dihapus`);
			} else {
				showAlertModal('error', data.message || 'Gagal menghapus data');
			}
		} catch (err) {
			showAlertModal('error', 'Gagal terhubung ke server');
			console.error('Error deleting class:', err);
		} finally {
			isLoading = false;
			pendingDeleteClass = null;
		}
	}

	function handleAlertConfirm() {
		if (pendingDeleteClass) {
			confirmDelete();
		}
	}

	function handleAlertCancel() {
		pendingDeleteClass = null;
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class=" bg-gray-50 p-4 sm:p-6 lg:p-8">
	<div class="mx-10">
		<!-- Header Section -->
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-bold text-blue-600 sm:text-3xl md:text-4xl">Manajemen Kelas</h1>
			<p class="text-gray-600">
				Kelola data kelas di sini. <a
					href="../support"
					class="text-blue-500 hover:text-blue-600 hover:underline">butuh keterangan?</a
				>
			</p>
			<button
				on:click={handleAddClick}
				class="hover:-lg flex w-fit items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-blue-50 capitalize transition-all duration-75 hover:bg-blue-700"
			>
				<AddIcon /> tambah kelas
			</button>
		</div>

		<!-- Table Section -->
		<div class="mt-2">
			<div class="w-full overflow-hidden rounded-xl border border-gray-300 bg-white">
				<header class="border-b border-gray-200 bg-gray-50 px-6 py-4">
					<h2 class="text-lg font-semibold text-gray-900">Daftar Kelas</h2>
				</header>

				{#if isLoading && classes.length === 0}
					<div class="flex items-center justify-center py-12">
						<svg class="h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24">
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
						<span class="ml-2 text-gray-600">Memuat data...</span>
					</div>
				{:else if classes.length === 0}
					<div class="py-12 text-center text-gray-500">
						<svg
							class="mx-auto h-12 w-12 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
						<p class="mt-2">Belum ada data kelas</p>
						<button
							on:click={handleAddClick}
							class="mt-2 rounded-md bg-blue-500 px-4 py-2 text-blue-50 capitalize hover:bg-blue-700"
						>
							Tambah kelas pertama
						</button>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm text-gray-600">
							<thead class="bg-gray-50 text-xs text-gray-700 uppercase">
								<tr>
									<th scope="col" class="px-6 py-3 font-medium">No</th>
									<th scope="col" class="px-6 py-3 font-medium">Nama Kelas</th>
									<th scope="col" class="px-6 py-3 text-right font-medium">Aksi</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each classes as classData, index (classData.id)}
									<tr
										class="transition-colors duration-150 hover:bg-gray-50"
										in:fly={{ y: 20, duration: 300, delay: index * 50 }}
									>
										<td class="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
										<td class="px-6 py-4">
											<span
												class="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
											>
												{classData.className}
											</span>
										</td>
										<td class="px-6 py-4 text-right">
											<div class="flex justify-end gap-2">
												<button
													on:click={() => handleEditClick(classData)}
													class="rounded p-1.5 text-blue-600 transition-all duration-75 hover:scale-110 hover:bg-blue-50 active:scale-95"
													title="Edit"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														class="h-5 w-5"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
														/>
													</svg>
												</button>
												<button
													on:click={() => handleDeleteClick(classData)}
													class="rounded p-1.5 text-red-600 transition-all duration-75 hover:scale-110 hover:bg-red-50 active:scale-95"
													title="Hapus"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														class="h-5 w-5"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
														/>
													</svg>
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Footer with count -->
					<div
						class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3"
					>
						<div class="text-sm text-gray-500">
							Total <span class="font-medium">{classes.length}</span> kelas
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Modal Popup -->
{#if showModal}
	<div
		class="fixed inset-0 z-2 flex items-center justify-center bg-black/20 p-4 shadow-md backdrop-blur-xs"
		transition:fade={{ duration: 75 }}
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		role="dialog"
		tabindex="-1"
		aria-modal="true"
	>
		<div class="w-full max-w-md rounded-lg bg-white" transition:fly={{ y: 20, duration: 200 }}>
			<!-- Header -->
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="text-lg font-semibold text-gray-900">
					{isEditing ? 'Edit Kelas' : 'Tambah Kelas'}
				</h2>
				<button
					aria-label="close"
					on:click={handleCloseModal}
					class="text-gray-400 hover:text-gray-600"
				>
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

			<!-- Body -->
			<form on:submit|preventDefault={handleSubmit} class="p-6">
				{#if error}
					<div class="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
				{/if}

				<div class="space-y-6">
					<!-- Material Design Input -->
					<div class="relative w-full">
						<input
							type="text"
							id="className"
							placeholder=" "
							bind:value={currentClass.className}
							class="peer text-md w-full rounded border border-gray-400 bg-transparent px-2 py-2 text-gray-800 transition-all duration-75 outline-none placeholder-shown:py-3 hover:border-gray-600 focus:border focus:border-blue-600 focus:px-3 focus:py-3"
							required
						/>
						<label
							for="className"
							class="text-md pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-75 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
						>
							Nama Kelas
						</label>
					</div>
					<p class="text-xs text-gray-500">Contoh: X, XI, XII</p>
				</div>

				<!-- Footer -->
				<div class="mt-6 flex justify-end gap-3">
					<button
						type="button"
						on:click={handleCloseModal}
						class="rounded px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
					>
						{#if isSubmitting}
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
	</div>
{/if}

<!-- Alert Modal -->
<ModalAlert
	bind:show={showAlert}
	type={alertType}
	message={alertMessage}
	showCancel={alertShowCancel}
	confirmText={alertConfirmText}
	on:confirm={handleAlertConfirm}
	on:cancel={handleAlertCancel}
/>
