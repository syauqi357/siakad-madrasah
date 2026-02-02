<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import AddIcon from '$lib/components/icons/addIcon.svelte';
	import { API_FETCH } from '$lib/api';

	// ==================== TYPES ====================
	interface AcademicYear {
		id: number;
		name: string;
		startYear: number;
		endYear: number;
		startDate: string | null;
		endDate: string | null;
		isActive: number;
	}

	// ==================== STATE ====================
	let academicYears: AcademicYear[] = [];
	let isLoading = false;
	let isSubmitting = false;
	let showModal = false;
	let isEditing = false;
	let error = '';

	const emptyAcademicYear: AcademicYear = {
		id: 0,
		name: '',
		startYear: new Date().getFullYear(),
		endYear: new Date().getFullYear() + 1,
		startDate: null,
		endDate: null,
		isActive: 0
	};

	let currentAcademicYear: AcademicYear = { ...emptyAcademicYear };

	// ==================== COMPUTED ====================
	$: {
		// Auto-generate name when startYear or endYear changes
		if (!isEditing || !currentAcademicYear.name) {
			currentAcademicYear.name = `${currentAcademicYear.startYear}/${currentAcademicYear.endYear}`;
		}
	}

	// ==================== FUNCTIONS ====================
	async function fetchAcademicYears() {
		isLoading = true;
		error = '';
		try {
			const response = await API_FETCH('/routes/api/academic-years');
			const data = await response.json();
			if (data.success) {
				academicYears = data.data;
			} else {
				error = data.message || 'Gagal memuat data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error fetching academic years:', err);
		} finally {
			isLoading = false;
		}
	}

	function handleAddClick() {
		currentAcademicYear = { ...emptyAcademicYear };
		isEditing = false;
		showModal = true;
	}

	function handleEditClick(academicYear: AcademicYear) {
		currentAcademicYear = {
			...academicYear,
			startDate: academicYear.startDate ? academicYear.startDate.split('T')[0] : null,
			endDate: academicYear.endDate ? academicYear.endDate.split('T')[0] : null
		};
		isEditing = true;
		showModal = true;
	}

	function handleCloseModal() {
		showModal = false;
		currentAcademicYear = { ...emptyAcademicYear };
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
		if (!currentAcademicYear.name.trim()) {
			error = 'Nama tahun ajaran harus diisi';
			return;
		}

		if (!currentAcademicYear.startYear || !currentAcademicYear.endYear) {
			error = 'Tahun mulai dan tahun akhir harus diisi';
			return;
		}

		if (currentAcademicYear.startYear >= currentAcademicYear.endYear) {
			error = 'Tahun mulai harus lebih kecil dari tahun akhir';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			let response;
			const payload = {
				name: currentAcademicYear.name,
				startYear: currentAcademicYear.startYear,
				endYear: currentAcademicYear.endYear,
				startDate: currentAcademicYear.startDate || null,
				endDate: currentAcademicYear.endDate || null,
				isActive: currentAcademicYear.isActive ? 1 : 0
			};

			if (isEditing && currentAcademicYear.id) {
				response = await API_FETCH(`/routes/api/academic-years/${currentAcademicYear.id}`, {
					method: 'PUT',
					body: JSON.stringify(payload)
				});
			} else {
				response = await API_FETCH('/routes/api/academic-years', {
					method: 'POST',
					body: JSON.stringify(payload)
				});
			}

			const data = await response.json();
			if (data.success) {
				await fetchAcademicYears();
				handleCloseModal();
			} else {
				error = data.message || 'Gagal menyimpan data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error saving academic year:', err);
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete(academicYear: AcademicYear) {
		if (!confirm(`Apakah Anda yakin ingin menghapus tahun ajaran "${academicYear.name}"?`)) {
			return;
		}

		isLoading = true;
		error = '';

		try {
			const response = await API_FETCH(`/routes/api/academic-years/${academicYear.id}`, {
				method: 'DELETE'
			});

			const data = await response.json();
			if (data.success) {
				await fetchAcademicYears();
			} else {
				error = data.message || 'Gagal menghapus data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error deleting academic year:', err);
		} finally {
			isLoading = false;
		}
	}

	async function handleSetActive(academicYear: AcademicYear) {
		if (academicYear.isActive) return;

		if (!confirm(`Jadikan "${academicYear.name}" sebagai tahun ajaran aktif?`)) {
			return;
		}

		isLoading = true;
		error = '';

		try {
			const response = await API_FETCH(`/routes/api/academic-years/${academicYear.id}`, {
				method: 'PUT',
				body: JSON.stringify({ isActive: 1 })
			});

			const data = await response.json();
			if (data.success) {
				await fetchAcademicYears();
			} else {
				error = data.message || 'Gagal mengubah status';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error setting active:', err);
		} finally {
			isLoading = false;
		}
	}

	function formatDate(dateString: string | null): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	// ==================== LIFECYCLE ====================
	onMount(async () => {
		await fetchAcademicYears();
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header Section -->
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-bold text-blue-600 sm:text-3xl md:text-4xl">
				Manajemen Tahun Ajaran
			</h1>
			<p class="text-gray-600">Kelola data tahun ajaran sekolah.</p>
		</div>

		<!-- Error Message -->
		{#if error && !showModal}
			<div
				class="mt-4 rounded-md bg-red-50 p-4 text-red-700"
				transition:fly={{ y: -10, duration: 300 }}
			>
				{error}
			</div>
		{/if}

		<!-- Add Button -->
		<div class="mt-6">
			<button
				on:click={handleAddClick}
				class="flex w-fit items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-blue-50 capitalize transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-95"
			>
				<AddIcon /> tambah tahun ajaran
			</button>
		</div>

		<!-- Table Card -->
		<div class="mt-6">
			<div class="w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
				<header class="border-b border-gray-200 bg-gray-50 px-6 py-4">
					<h2 class="text-lg font-semibold text-gray-900">Daftar Tahun Ajaran</h2>
				</header>

				{#if isLoading && academicYears.length === 0}
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
				{:else if academicYears.length === 0}
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
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<p class="mt-2">Belum ada data tahun ajaran</p>
						<button on:click={handleAddClick} class="mt-2 text-blue-600 hover:underline">
							Tambah tahun ajaran pertama
						</button>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm text-gray-600">
							<thead class="bg-gray-50 text-xs text-gray-700 uppercase">
								<tr>
									<th scope="col" class="px-6 py-3 font-medium">No</th>
									<th scope="col" class="px-6 py-3 font-medium">Tahun Ajaran</th>
									<th scope="col" class="px-6 py-3 font-medium">Periode</th>
									<th scope="col" class="px-6 py-3 font-medium">Tanggal Mulai</th>
									<th scope="col" class="px-6 py-3 font-medium">Tanggal Selesai</th>
									<th scope="col" class="px-6 py-3 font-medium">Status</th>
									<th scope="col" class="px-6 py-3 text-right font-medium">Aksi</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each academicYears as ay, index (ay.id)}
									<tr
										class="transition-colors duration-150 hover:bg-gray-50"
										in:fly={{ y: 20, duration: 300, delay: index * 50 }}
									>
										<td class="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
										<td class="px-6 py-4 font-medium text-gray-900">{ay.name}</td>
										<td class="px-6 py-4">
											<span
												class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
											>
												{ay.startYear} - {ay.endYear}
											</span>
										</td>
										<td class="px-6 py-4">{formatDate(ay.startDate)}</td>
										<td class="px-6 py-4">{formatDate(ay.endDate)}</td>
										<td class="px-6 py-4">
											{#if ay.isActive}
												<span
													class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800"
												>
													<span class="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
													Aktif
												</span>
											{:else}
												<button
													on:click={() => handleSetActive(ay)}
													class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
													title="Klik untuk mengaktifkan"
												>
													Tidak Aktif
												</button>
											{/if}
										</td>
										<td class="px-6 py-4 text-right">
											<div class="flex justify-end gap-2">
												<button
													on:click={() => handleEditClick(ay)}
													class="rounded p-1.5 text-blue-600 transition-all duration-200 hover:scale-110 hover:bg-blue-50 active:scale-95"
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
													on:click={() => handleDelete(ay)}
													class="rounded p-1.5 text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 active:scale-95"
													title="Hapus"
													disabled={ay.isActive === 1}
													class:opacity-50={ay.isActive === 1}
													class:cursor-not-allowed={ay.isActive === 1}
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

					<div
						class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3"
					>
						<div class="text-sm text-gray-500">
							Total <span class="font-medium">{academicYears.length}</span> tahun ajaran
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- ==================== MODAL ==================== -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		role="dialog"
		tabindex="-1"
		aria-modal="true"
	>
		<div
			class="w-full max-w-lg rounded-lg bg-white shadow-lg"
			transition:fly={{ y: 20, duration: 200 }}
		>
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="text-lg font-semibold text-gray-900">
					{isEditing ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
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

			<form on:submit|preventDefault={handleSubmit} class="p-6">
				{#if error}
					<div class="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
				{/if}

				<div class="space-y-4">
					<!-- Year Range -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="startYear" class="mb-1 block text-sm font-medium text-gray-700">
								Tahun Mulai <span class="text-red-500">*</span>
							</label>
							<input
								type="number"
								id="startYear"
								bind:value={currentAcademicYear.startYear}
								class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								placeholder="2024"
								min="2000"
								max="2100"
								required
							/>
						</div>
						<div>
							<label for="endYear" class="mb-1 block text-sm font-medium text-gray-700">
								Tahun Akhir <span class="text-red-500">*</span>
							</label>
							<input
								type="number"
								id="endYear"
								bind:value={currentAcademicYear.endYear}
								class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								placeholder="2025"
								min="2000"
								max="2100"
								required
							/>
						</div>
					</div>

					<!-- Name -->
					<div>
						<label for="name" class="mb-1 block text-sm font-medium text-gray-700">
							Nama Tahun Ajaran <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							bind:value={currentAcademicYear.name}
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							placeholder="2024/2025"
							required
						/>
						<p class="mt-1 text-xs text-gray-500">Nama akan otomatis terisi berdasarkan tahun</p>
					</div>

					<!-- Date Range -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="startDate" class="mb-1 block text-sm font-medium text-gray-700">
								Tanggal Mulai
							</label>
							<input
								type="date"
								id="startDate"
								bind:value={currentAcademicYear.startDate}
								class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							/>
						</div>
						<div>
							<label for="endDate" class="mb-1 block text-sm font-medium text-gray-700">
								Tanggal Selesai
							</label>
							<input
								type="date"
								id="endDate"
								bind:value={currentAcademicYear.endDate}
								class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							/>
						</div>
					</div>

					<!-- Is Active -->
					<div class="flex items-center gap-3">
						<input
							type="checkbox"
							id="isActive"
							bind:checked={currentAcademicYear.isActive}
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label for="isActive" class="text-sm font-medium text-gray-700">
							Jadikan sebagai tahun ajaran aktif
						</label>
					</div>
					{#if currentAcademicYear.isActive}
						<p class="text-xs text-amber-600">
							Mengaktifkan tahun ajaran ini akan menonaktifkan tahun ajaran yang sedang aktif.
						</p>
					{/if}
				</div>

				<div class="mt-6 flex justify-end gap-3">
					<button
						type="button"
						on:click={handleCloseModal}
						class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{isSubmitting ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
