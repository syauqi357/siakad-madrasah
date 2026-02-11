<script lang="ts">
	import { API_FETCH } from '$lib/api';
	import { onMount } from 'svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	// Tab state
	let activeTab: 'list' | 'form' = 'list';

	// Form state
	let isEditing = false;
	let editingId: number | null = null;
	let formData = {
		nip: '',
		fullName: '',
		gender: '',
		birthPlace: '',
		birthDate: '',
		religion: '',
		phoneNumber: '',
		personalEmail: ''
	};

	let isLoading = false;

	// Modal state
	let showAlert = false;
	let alertType: 'success' | 'error' | 'warning' | 'info' = 'success';
	let alertMessage = '';

	// Delete confirmation modal
	let showDeleteConfirm = false;
	let deleteTargetId: number | null = null;
	let deleteTargetName = '';

	// Teacher list
	let teachers: any[] = [];
	let loadingTeachers = true;

	onMount(() => {
		fetchTeachers();
	});

	async function fetchTeachers() {
		loadingTeachers = true;
		try {
			const res = await API_FETCH('/routes/api/teachers');
			if (res.ok) {
				const data = await res.json();
				teachers = data.data || data;
			}
		} catch (e) {
			console.error('Failed to fetch teachers:', e);
		} finally {
			loadingTeachers = false;
		}
	}

	async function handleSubmit() {
		if (!formData.fullName.trim()) {
			alertType = 'warning';
			alertMessage = 'Nama lengkap wajib diisi';
			showAlert = true;
			return;
		}

		isLoading = true;

		try {
			let res;
			if (isEditing && editingId) {
				// Update existing teacher
				res = await API_FETCH(`/routes/api/teachers/${editingId}`, {
					method: 'PUT',
					body: JSON.stringify(formData)
				});
			} else {
				// Create new teacher
				res = await API_FETCH('/routes/api/teachers', {
					method: 'POST',
					body: JSON.stringify(formData)
				});
			}

			if (res.ok) {
				alertType = 'success';
				alertMessage = isEditing
					? 'Data guru berhasil diperbarui!'
					: 'Data guru berhasil disimpan!';
				showAlert = true;
				resetForm();
				activeTab = 'list';
				fetchTeachers();
			} else {
				const result = await res.json();
				alertType = 'error';
				alertMessage = result.message || 'Gagal menyimpan data';
				showAlert = true;
			}
		} catch (e) {
			console.error('Error:', e);
			alertType = 'error';
			alertMessage = 'Terjadi kesalahan sistem';
			showAlert = true;
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		formData = {
			nip: '',
			fullName: '',
			gender: '',
			birthPlace: '',
			birthDate: '',
			religion: '',
			phoneNumber: '',
			personalEmail: ''
		};
		isEditing = false;
		editingId = null;
	}

	function handleEdit(teacher: any) {
		formData = {
			nip: teacher.nip || '',
			fullName: teacher.fullName || '',
			gender: teacher.gender || '',
			birthPlace: teacher.birthPlace || '',
			birthDate: teacher.birthDate || '',
			religion: teacher.religion || '',
			phoneNumber: teacher.phoneNumber || '',
			personalEmail: teacher.personalEmail || ''
		};
		isEditing = true;
		editingId = teacher.id;
		activeTab = 'form';
	}

	function confirmDelete(id: number, name: string) {
		deleteTargetId = id;
		deleteTargetName = name;
		showDeleteConfirm = true;
	}

	async function handleDeleteConfirm() {
		if (!deleteTargetId) return;

		try {
			const res = await API_FETCH(`/routes/api/teachers/${deleteTargetId}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				alertType = 'success';
				alertMessage = 'Data guru berhasil dihapus';
				showAlert = true;
				fetchTeachers();
			} else {
				alertType = 'error';
				alertMessage = 'Gagal menghapus data';
				showAlert = true;
			}
		} catch (e) {
			alertType = 'error';
			alertMessage = 'Terjadi kesalahan';
			showAlert = true;
		}

		deleteTargetId = null;
		deleteTargetName = '';
	}

	import AddIcon from '$lib/components/icons/addIcon.svelte';
</script>

<!-- Alert Modal -->
<ModalAlert bind:show={showAlert} type={alertType} message={alertMessage} confirmText="OK" />

<!-- Delete Confirmation Modal -->
<ModalAlert
	bind:show={showDeleteConfirm}
	type="warning"
	message="Yakin ingin menghapus data guru {deleteTargetName}?"
	showCancel={true}
	confirmText="Hapus"
	cancelText="Batal"
	on:confirm={handleDeleteConfirm}
/>

<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-bold text-blue-600 sm:text-3xl">Daftar GTK</h1>
			<p class="text-gray-600">Guru dan Tenaga Kependidikan</p>
		</div>

		<!-- Tabs -->
		<div class="mt-6 border-b border-gray-200">
			<nav class="-mb-px flex gap-4">
				<button
					on:click={() => (activeTab = 'list')}
					class="border-b-2 px-1 py-3 text-sm font-medium transition-colors {activeTab === 'list'
						? 'border-blue-600 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
				>
					Daftar Guru
				</button>
				<button
					on:click={() => {
						if (isEditing) resetForm();
						activeTab = 'form';
					}}
					class="border-b-2 px-1 py-3 text-sm font-medium transition-colors {activeTab === 'form'
						? 'border-blue-600 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
				>
					{isEditing ? 'Edit Guru' : 'Tambah Guru Baru'}
				</button>
			</nav>
		</div>

		<!-- Tab Content -->
		{#if activeTab === 'list'}
			<!-- Teacher List -->
			<div class="mt-6">
				<div class="w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
					<header class="border-b border-gray-200 bg-gray-50 px-6 py-4">
						<h2 class="text-lg font-semibold text-gray-900">Daftar Guru</h2>
						<p class="text-sm text-gray-500">Total {teachers.length} guru terdaftar</p>
					</header>

					{#if loadingTeachers}
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
					{:else if teachers.length === 0}
						<div class="py-12 flex justify-center items-center flex-col text-gray-500">
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
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
							<p class="mt-2">Belum ada data guru</p>
							<button
								on:click={() => (activeTab = 'form')}
								class="mt-2 flex items-center justify-center rounded-md bg-blue-600 px-4 py-1.5 text-blue-50 capitalize"
							>
								<AddIcon /> Tambah guru pertama
							</button>
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-left text-sm text-gray-600">
								<thead class="bg-gray-50 text-xs text-gray-700 uppercase">
									<tr>
										<th scope="col" class="px-6 py-3 font-medium">No</th>
										<th scope="col" class="px-6 py-3 font-medium">NIP</th>
										<th scope="col" class="px-6 py-3 font-medium">Nama</th>
										<th scope="col" class="px-6 py-3 font-medium">L/P</th>
										<th scope="col" class="px-6 py-3 font-medium">No. Telepon</th>
										<th scope="col" class="px-6 py-3 font-medium">Email</th>
										<th scope="col" class="px-6 py-3 text-right font-medium">Aksi</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									{#each teachers as teacher, i}
										<tr class="transition-colors duration-150 hover:bg-gray-50">
											<td class="px-6 py-4 font-medium text-gray-900">{i + 1}</td>
											<td class="px-6 py-4">
												{#if teacher.nip}
													<span
														class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
													>
														{teacher.nip}
													</span>
												{:else}
													<span class="text-gray-400">-</span>
												{/if}
											</td>
											<td class="px-6 py-4 font-medium text-gray-900">{teacher.fullName}</td>
											<td class="px-6 py-4">
												{#if teacher.gender === 'male'}
													<span
														class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700"
													>
														L
													</span>
												{:else if teacher.gender === 'female'}
													<span
														class="inline-flex items-center rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-pink-700"
													>
														P
													</span>
												{:else}
													<span class="text-gray-400">-</span>
												{/if}
											</td>
											<td class="px-6 py-4">{teacher.phoneNumber || '-'}</td>
											<td class="px-6 py-4">{teacher.personalEmail || '-'}</td>
											<td class="px-6 py-4 text-right">
												<div class="flex justify-end gap-2">
													<button
														on:click={() => handleEdit(teacher)}
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
														on:click={() => confirmDelete(teacher.id, teacher.fullName)}
														class="rounded p-1.5 text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 active:scale-95"
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
					{/if}
				</div>
			</div>
		{:else}
			<!-- Add Teacher Form -->
			<div class="mt-6">
				<div class="w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
					<header class="border-b border-gray-200 bg-gray-50 px-6 py-4">
						<h2 class="text-lg font-semibold text-gray-900">
							{isEditing ? 'Edit Data Guru' : 'Tambah Guru Baru'}
						</h2>
					</header>

					<form on:submit|preventDefault={handleSubmit} class="p-6">
						<div class="grid gap-4 md:grid-cols-2">
							<!-- NIP -->
							<div>
								<label for="nip" class="mb-1 block text-sm font-medium text-gray-700">NIP</label>
								<input
									type="text"
									id="nip"
									bind:value={formData.nip}
									placeholder="Masukkan 18 digit NIP"
									class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								/>
							</div>

							<!-- Nama Lengkap -->
							<div>
								<label for="fullName" class="mb-1 block text-sm font-medium text-gray-700">
									Nama Lengkap <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="fullName"
									bind:value={formData.fullName}
									placeholder="Masukkan nama lengkap beserta gelar"
									required
									class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								/>
							</div>

							<!-- Jenis Kelamin -->
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-700">Jenis Kelamin</label>
								<div class="flex gap-6 pt-1">
									<label class="flex cursor-pointer items-center gap-2">
										<input
											type="radio"
											name="gender"
											value="male"
											bind:group={formData.gender}
											class="h-4 w-4 text-blue-600"
										/>
										<span class="text-sm text-gray-600">Laki-laki</span>
									</label>
									<label class="flex cursor-pointer items-center gap-2">
										<input
											type="radio"
											name="gender"
											value="female"
											bind:group={formData.gender}
											class="h-4 w-4 text-blue-600"
										/>
										<span class="text-sm text-gray-600">Perempuan</span>
									</label>
								</div>
							</div>

							<!-- Agama -->
							<div>
								<label for="religion" class="mb-1 block text-sm font-medium text-gray-700"
									>Agama</label
								>
								<select
									id="religion"
									bind:value={formData.religion}
									class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								>
									<option value="">Pilih Agama</option>
									<option value="Islam">Islam</option>
									<option value="Kristen">Kristen</option>
									<option value="Katolik">Katolik</option>
									<option value="Hindu">Hindu</option>
									<option value="Buddha">Buddha</option>
									<option value="Khonghucu">Khonghucu</option>
								</select>
							</div>

							<!-- Tempat Lahir -->
							<div>
								<label for="birthPlace" class="mb-1 block text-sm font-medium text-gray-700"
									>Tempat Lahir</label
								>
								<input
									type="text"
									id="birthPlace"
									bind:value={formData.birthPlace}
									placeholder="Masukkan kota/kabupaten kelahiran"
									class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								/>
							</div>

							<!-- Tanggal Lahir -->
							<div>
								<label for="birthDate" class="mb-1 block text-sm font-medium text-gray-700"
									>Tanggal Lahir</label
								>
								<input
									type="date"
									id="birthDate"
									bind:value={formData.birthDate}
									class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								/>
							</div>

							<!-- No. Telepon -->
							<div>
								<label for="phoneNumber" class="mb-1 block text-sm font-medium text-gray-700"
									>No. Telepon</label
								>
								<input
									type="text"
									id="phoneNumber"
									bind:value={formData.phoneNumber}
									placeholder="Masukkan nomor telepon aktif"
									class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								/>
							</div>

							<!-- Email -->
							<div>
								<label for="personalEmail" class="mb-1 block text-sm font-medium text-gray-700"
									>Email</label
								>
								<input
									type="email"
									id="personalEmail"
									bind:value={formData.personalEmail}
									placeholder="Masukkan alamat email pribadi"
									class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								/>
							</div>
						</div>

						<!-- Submit -->
						<div class="mt-6 flex justify-end gap-3">
							<button
								type="button"
								on:click={() => {
									const wasEditing = isEditing;
									resetForm();
									if (wasEditing) activeTab = 'list';
								}}
								class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
							>
								Batal
							</button>
							<button
								type="submit"
								disabled={isLoading}
								class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
							>
								{isLoading ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>
