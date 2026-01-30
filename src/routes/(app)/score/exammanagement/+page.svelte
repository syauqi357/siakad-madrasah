<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';
	import ModalExam from '$lib/components/modal/modalexam.svelte';
	import AddIcon from '\$lib/components/icons/addIcon.svelte';
	import { goto } from '$app/navigation';
	import ArrowLeft from '\$lib/components/icons/arrow_left.svelte';

	// State
	let loading = true;
	let assessmentTypes: any[] = [];
	let stats = {
		total: 0,
		active: 0,
		inactive: 0,
		totalScoresRecorded: 0
	};

	// Modal State
	let showModal = false;
	let isEditing = false;
	let editingId: number | null = null;
	let formData = {
		code: '',
		name: '',
		defaultWeight: ''
	};
	let formError = '';
	let formLoading = false;

	// Delete confirmation
	let showDeleteConfirm = false;
	let deleteTarget: any = null;

	// Alert state
	let showAlert = false;
	let alertType: 'success' | 'error' | 'warning' | 'info' = 'success';
	let alertMessage = '';

	async function fetchData() {
		loading = true;
		try {
			const [typesRes, statsRes] = await Promise.all([
				API_FETCH('/routes/api/assessment-types'),
				API_FETCH('/routes/api/assessment-types/stats')
			]);

			if (typesRes.ok) {
				const typesData = await typesRes.json();
				assessmentTypes = typesData.data || typesData || [];
			}

			if (statsRes.ok) {
				const statsData = await statsRes.json();
				stats = statsData;
			}
		} catch (e) {
			console.error('Failed to fetch assessment types:', e);
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		isEditing = false;
		editingId = null;
		formData = { code: '', name: '', defaultWeight: '' };
		formError = '';
		showModal = true;
	}

	function openEditModal(item: any) {
		isEditing = true;
		editingId = item.id;
		formData = {
			code: item.code,
			name: item.name,
			defaultWeight: item.defaultWeight?.toString() || ''
		};
		formError = '';
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		formError = '';
	}

	async function handleSubmit(event: CustomEvent) {
		const data = event.detail;
		formError = '';

		if (!data.code.trim() || !data.name.trim()) {
			formError = 'Kode dan nama penilaian wajib diisi';
			return;
		}

		formLoading = true;
		try {
			const payload = {
				code: data.code.trim(),
				name: data.name.trim(),
				defaultWeight: data.defaultWeight ? parseInt(data.defaultWeight) : null
			};

			let response;
			if (isEditing && editingId) {
				response = await API_FETCH(`/routes/api/assessment-types/${editingId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
			} else {
				response = await API_FETCH('/routes/api/assessment-types', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
			}

			if (response.ok) {
				closeModal();
				await fetchData();
				alertType = 'success';
				alertMessage = isEditing
					? 'Jenis penilaian berhasil diperbarui'
					: 'Jenis penilaian berhasil ditambahkan';
				showAlert = true;
			} else {
				const err = await response.json();
				formError = err.message || 'Gagal menyimpan data';
			}
		} catch (e: any) {
			formError = e.message || 'Terjadi kesalahan';
		} finally {
			formLoading = false;
		}
	}

	async function toggleStatus(item: any) {
		try {
			const response = await API_FETCH(`/routes/api/assessment-types/${item.id}/toggle`, {
				method: 'PATCH'
			});

			if (response.ok) {
				await fetchData();
				alertType = 'success';
				alertMessage = `Status berhasil diubah menjadi ${item.isActive ? 'Nonaktif' : 'Aktif'}`;
				showAlert = true;
			}
		} catch (e) {
			console.error('Failed to toggle status:', e);
			alertType = 'error';
			alertMessage = 'Gagal mengubah status';
			showAlert = true;
		}
	}

	function confirmDelete(item: any) {
		deleteTarget = item;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		if (!deleteTarget) return;

		try {
			const response = await API_FETCH(`/routes/api/assessment-types/${deleteTarget.id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				showDeleteConfirm = false;
				deleteTarget = null;
				await fetchData();
				alertType = 'success';
				alertMessage = 'Jenis penilaian berhasil dihapus';
				showAlert = true;
			} else {
				const err = await response.json();
				showDeleteConfirm = false;
				alertType = 'error';
				alertMessage = err.message || 'Gagal menghapus data';
				showAlert = true;
			}
		} catch (e: any) {
			showDeleteConfirm = false;
			alertType = 'error';
			alertMessage = e.message || 'Terjadi kesalahan';
			showAlert = true;
		}
	}

	function cancelDelete() {
		showDeleteConfirm = false;
		deleteTarget = null;
	}

	onMount(() => {
		fetchData();
	});
</script>

<div class="md:px-20 px-0">
	<button
		on:click={() => goto('/score/exam')}
		class="my-4 flex w-fit items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-2 text-sm text-blue-50 capitalize transition-all ease-in-out hover:gap-4 hover:bg-blue-600"
	>
		<ArrowLeft /> kembali ke halaman ujian
	</button>
	<!-- Header -->
	<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
		<div>
			<h1 class="text-3xl font-bold text-blue-600 capitalize">Jenis Penilaian</h1>
			<p class="text-md text-slate-600">Kelola jenis penilaian untuk input nilai siswa</p>
		</div>

		<button
			on:click={openAddModal}
			class="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-blue-50 transition-colors hover:bg-blue-600"
		>
			<AddIcon />
			Tambah Jenis
		</button>
	</div>

	<!-- Stat Cards -->
	<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
		<div class="rounded-lg border-2 border-slate-200 bg-white p-4">
			<p class="text-sm font-medium text-slate-500">Total</p>
			<p class="text-2xl font-bold text-slate-900">{stats.total}</p>
		</div>
		<div class="rounded-lg border-2 border-green-200 bg-green-50 p-4">
			<p class="text-sm font-medium text-green-600">Aktif</p>
			<p class="text-2xl font-bold text-green-700">{stats.active}</p>
		</div>
		<div class="rounded-lg border-2 border-slate-200 bg-slate-50 p-4">
			<p class="text-sm font-medium text-slate-500">Nonaktif</p>
			<p class="text-2xl font-bold text-slate-600">{stats.inactive}</p>
		</div>
		<div class="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
			<p class="text-sm font-medium text-blue-600">Digunakan</p>
			<p class="text-2xl font-bold text-blue-700">{stats.totalScoresRecorded}</p>
		</div>
	</div>

	<!-- Table -->
	<div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-slate-200 bg-slate-50">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-semibold text-slate-700">Kode</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-slate-700">Nama Penilaian</th>
						<th class="px-4 py-3 text-center text-sm font-semibold text-slate-700">Bobot</th>
						<th class="px-4 py-3 text-center text-sm font-semibold text-slate-700">Status</th>
						<th class="px-4 py-3 text-center text-sm font-semibold text-slate-700">Digunakan</th>
						<th class="px-4 py-3 text-center text-sm font-semibold text-slate-700">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100">
					{#if loading}
						<tr>
							<td colspan="6" class="px-4 py-8 text-center text-slate-500">
								<span class="loading loading-spinner loading-md"></span>
								<p class="mt-2">Memuat data...</p>
							</td>
						</tr>
					{:else if assessmentTypes.length === 0}
						<tr>
							<td colspan="6" class="px-4 py-8 text-center text-slate-500">
								Belum ada jenis penilaian
							</td>
						</tr>
					{:else}
						{#each assessmentTypes as item}
							<tr class="hover:bg-slate-50">
								<td class="px-4 py-3">
									<span class="text-md rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">
										{item.code}
									</span>
								</td>
								<td class="px-4 py-3 text-sm text-slate-900">{item.name}</td>
								<td class="px-4 py-3 text-center text-sm text-slate-600">
									{item.defaultWeight ? `${item.defaultWeight}%` : '-'}
								</td>
								<td class="px-4 py-3 text-center">
									{#if item.isActive}
										<span
											class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
										>
											<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
											Aktif
										</span>
									{:else}
										<span
											class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500"
										>
											<span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
											Nonaktif
										</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-center text-sm text-slate-600">
									{item.usageCount || 0}
								</td>
								<td class="px-4 py-3 text-center">
									<div class="flex items-center justify-center gap-1">
										<button
											on:click={() => openEditModal(item)}
											class="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
											title="Edit"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
												/>
											</svg>
										</button>
										<button
											on:click={() => toggleStatus(item)}
											class="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-amber-600"
											title={item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
										<button
											on:click={() => confirmDelete(item)}
											class="rounded p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
											title="Hapus"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Add/Edit Modal -->
<ModalExam
	bind:show={showModal}
	{isEditing}
	bind:data={formData}
	error={formError}
	loading={formLoading}
	on:submit={handleSubmit}
	on:close={closeModal}
/>

<!-- Delete Confirmation Modal -->
<ModalAlert
	bind:show={showDeleteConfirm}
	type="warning"
	message="Yakin ingin menghapus {deleteTarget?.name}? Tindakan ini tidak dapat dibatalkan."
	showCancel={true}
	confirmText="Hapus"
	cancelText="Batal"
	on:confirm={handleDelete}
	on:cancel={cancelDelete}
	on:close={cancelDelete}
/>

<!-- Success/Error Alert -->
<ModalAlert bind:show={showAlert} type={alertType} message={alertMessage} />
