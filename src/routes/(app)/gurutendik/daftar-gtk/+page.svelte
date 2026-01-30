<script lang="ts">
	import { API_FETCH } from '$lib/api';
	import { onMount } from 'svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	// Form state
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
	let showForm = false;

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
			const res = await API_FETCH('/routes/api/teachers', {
				method: 'POST',
				body: JSON.stringify(formData)
			});

			if (res.ok) {
				alertType = 'success';
				alertMessage = 'Data guru berhasil disimpan!';
				showAlert = true;
				resetForm();
				showForm = false;
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

<div class="p-4 md:p-6">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Daftar GTK</h1>
			<p class="text-sm text-slate-500">Guru dan Tenaga Kependidikan</p>
		</div>
		<button
			on:click={() => (showForm = !showForm)}
			class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
		>
			{showForm ? 'Tutup Form' : '+ Tambah Guru'}
		</button>
	</div>


	<!-- Form -->
	{#if showForm}
		<div class="mb-6 rounded-lg border bg-white p-4">
			<h2 class="mb-4 font-semibold text-slate-700">Tambah Guru Baru</h2>
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<div class="grid gap-4 md:grid-cols-2">
					<!-- NIP -->
					<div>
						<label for="nip" class="mb-1 block text-sm text-slate-600">NIP</label>
						<input
							type="text"
							id="nip"
							bind:value={formData.nip}
							placeholder="198507152010011001"
							class="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
						/>
					</div>

					<!-- Nama Lengkap -->
					<div>
						<label for="fullName" class="mb-1 block text-sm text-slate-600"
							>Nama Lengkap <span class="text-red-500">*</span></label
						>
						<input
							type="text"
							id="fullName"
							bind:value={formData.fullName}
							placeholder="Ahmad Fauzi, S.Pd"
							required
							class="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
						/>
					</div>

					<!-- Jenis Kelamin -->
					<div>
						<label class="mb-1 block text-sm text-slate-600">Jenis Kelamin</label>
						<div class="flex gap-4">
							<label class="flex items-center gap-2">
								<input type="radio" name="gender" value="male" bind:group={formData.gender} />
								<span class="text-sm">Laki-laki</span>
							</label>
							<label class="flex items-center gap-2">
								<input type="radio" name="gender" value="female" bind:group={formData.gender} />
								<span class="text-sm">Perempuan</span>
							</label>
						</div>
					</div>

					<!-- Agama -->
					<div>
						<label for="religion" class="mb-1 block text-sm text-slate-600">Agama</label>
						<select
							id="religion"
							bind:value={formData.religion}
							class="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
						<label for="birthPlace" class="mb-1 block text-sm text-slate-600">Tempat Lahir</label>
						<input
							type="text"
							id="birthPlace"
							bind:value={formData.birthPlace}
							placeholder="Jakarta"
							class="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
						/>
					</div>

					<!-- Tanggal Lahir -->
					<div>
						<label for="birthDate" class="mb-1 block text-sm text-slate-600">Tanggal Lahir</label>
						<input
							type="date"
							id="birthDate"
							bind:value={formData.birthDate}
							class="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
						/>
					</div>

					<!-- No. Telepon -->
					<div>
						<label for="phoneNumber" class="mb-1 block text-sm text-slate-600">No. Telepon</label>
						<input
							type="text"
							id="phoneNumber"
							bind:value={formData.phoneNumber}
							placeholder="081234567890"
							class="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
						/>
					</div>

					<!-- Email -->
					<div>
						<label for="personalEmail" class="mb-1 block text-sm text-slate-600">Email</label>
						<input
							type="email"
							id="personalEmail"
							bind:value={formData.personalEmail}
							placeholder="guru@email.com"
							class="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
						/>
					</div>
				</div>

				<!-- Submit -->
				<div class="flex gap-2 pt-2">
					<button
						type="submit"
						disabled={isLoading}
						class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{isLoading ? 'Menyimpan...' : 'Simpan'}
					</button>
					<button
						type="button"
						on:click={() => {
							resetForm();
							showForm = false;
						}}
						class="rounded-md bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
					>
						Batal
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Teacher List -->
	<div class="rounded-lg border bg-white">
		<div class="border-b px-4 py-3">
			<h2 class="font-semibold text-slate-700">Daftar Guru ({teachers.length})</h2>
		</div>

		{#if loadingTeachers}
			<div class="p-8 text-center text-slate-500">Loading...</div>
		{:else if teachers.length === 0}
			<div class="p-8 text-center text-slate-500">Belum ada data guru</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-slate-50 text-left text-slate-600">
						<tr>
							<th class="px-4 py-3">No</th>
							<th class="px-4 py-3">NIP</th>
							<th class="px-4 py-3">Nama</th>
							<th class="px-4 py-3">L/P</th>
							<th class="px-4 py-3">No. Telepon</th>
							<th class="px-4 py-3">Email</th>
							<th class="px-4 py-3">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each teachers as teacher, i}
							<tr class="border-t hover:bg-slate-50">
								<td class="px-4 py-3">{i + 1}</td>
								<td class="px-4 py-3">{teacher.nip || '-'}</td>
								<td class="px-4 py-3 font-medium">{teacher.fullName}</td>
								<td class="px-4 py-3">{teacher.gender === 'male' ? 'L' : teacher.gender === 'female' ? 'P' : '-'}</td>
								<td class="px-4 py-3">{teacher.phoneNumber || '-'}</td>
								<td class="px-4 py-3">{teacher.personalEmail || '-'}</td>
								<td class="px-4 py-3">
									<button
										on:click={() => confirmDelete(teacher.id, teacher.fullName)}
										class="text-red-600 hover:underline"
									>
										Hapus
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
