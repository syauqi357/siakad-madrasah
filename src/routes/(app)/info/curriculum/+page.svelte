<script lang="ts">
	import { API_FETCH } from '$lib/api';
	import { onMount } from 'svelte';

	interface Curriculum {
		id: number;
		name: string;
		code: string;
		year: string;
		description: string;
		isActive: boolean;
	}

	interface AcademicYear {
		id: number;
		name: string;
		isActive: boolean;
	}

	let curricula: Curriculum[] = [];
	let academicYears: AcademicYear[] = [];
	let loading = true;
	let submitting = false;
	let error = '';
	let success = '';

	// Form state
	let isEditing = false;
	let editId: number | null = null;
	let form = {
		name: '',
		code: '',
		year: '',
		description: ''
	};

	async function fetchAcademicYears() {
		try {
			const response = await API_FETCH('/routes/api/academic-year');
			if (!response.ok) throw new Error('Failed to load');
			const result = await response.json();
			academicYears = result.data || [];
		} catch (e) {
			console.error('Failed to fetch academic years:', e);
		}
	}

	function resetForm() {
		form = { name: '', code: '', year: '', description: '' };
		isEditing = false;
		editId = null;
	}

	function editCurriculum(curriculum: Curriculum) {
		isEditing = true;
		editId = curriculum.id;
		form = {
			name: curriculum.name,
			code: curriculum.code,
			year: curriculum.year,
			description: curriculum.description
		};
		// Scroll to form
		document.getElementById('curriculum-form')?.scrollIntoView({ behavior: 'smooth' });
	}

	async function fetchCurricula() {
		loading = true;
		try {
			const response = await API_FETCH('/routes/api/curriculum');
			if (!response.ok) throw new Error('Failed to load');
			const result = await response.json();
			curricula = result.data || [];
		} catch (e) {
			error = 'Gagal memuat data kurikulum';
		} finally {
			loading = false;
		}
	}

	async function handleSubmit() {
		if (!form.name || !form.code || !form.year) {
			error = 'Nama, kode, dan tahun wajib diisi';
			return;
		}

		submitting = true;
		error = '';
		success = '';

		try {
			const url = isEditing ? `/routes/api/curriculum/${editId}` : '/routes/api/curriculum';
			const method = isEditing ? 'PUT' : 'POST';

			const response = await API_FETCH(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});

			if (!response.ok) throw new Error('Failed to save');

			success = isEditing ? 'Kurikulum berhasil diperbarui' : 'Kurikulum berhasil ditambahkan';
			resetForm();
			await fetchCurricula();
		} catch (e) {
			error = 'Gagal menyimpan kurikulum';
		} finally {
			submitting = false;
		}
	}

	async function deleteCurriculum(id: number) {
		if (!confirm('Yakin ingin menghapus kurikulum ini?')) return;

		try {
			const response = await API_FETCH(`/routes/api/curriculum/${id}`, {
				method: 'DELETE'
			});
			if (!response.ok) throw new Error('Failed to delete');
			success = 'Kurikulum berhasil dihapus';
			await fetchCurricula();
		} catch (e) {
			error = 'Gagal menghapus kurikulum';
		}
	}

	async function toggleActive(curriculum: Curriculum) {
		try {
			const response = await API_FETCH(`/routes/api/curriculum/${curriculum.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...curriculum, isActive: !curriculum.isActive })
			});
			if (!response.ok) throw new Error('Failed to update');
			await fetchCurricula();
		} catch (e) {
			error = 'Gagal mengubah status kurikulum';
		}
	}

	onMount(() => {
		fetchCurricula();
		fetchAcademicYears();
	});
</script>

<div class="space-y-6 p-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Kurikulum</h1>
		<p class="mt-1 text-sm text-slate-500">Kelola data kurikulum yang digunakan</p>
	</div>

	<!-- Alerts -->
	{#if error}
		<div class="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
			<p class="text-sm text-red-600">{error}</p>
			<button on:click={() => (error = '')} class="text-red-400 hover:text-red-600" aria-label="Close">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	{/if}

	{#if success}
		<div class="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
			<p class="text-sm text-green-600">{success}</p>
			<button on:click={() => (success = '')} class="text-green-400 hover:text-green-600" aria-label="close">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	{/if}

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Form Section -->
		<div class="lg:col-span-1">
			<div id="curriculum-form" class="rounded-lg border border-slate-200 bg-white p-5">
				<h2 class="mb-4 text-lg font-semibold text-slate-800">
					{isEditing ? 'Edit Kurikulum' : 'Tambah Kurikulum'}
				</h2>

				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					<div>
						<label for="name" class="mb-1 block text-sm font-medium text-slate-700">
							Nama Kurikulum <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							bind:value={form.name}
							placeholder="Kurikulum Merdeka"
							class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="code" class="mb-1 block text-sm font-medium text-slate-700">
							Kode <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="code"
							bind:value={form.code}
							placeholder="K-MERDEKA"
							class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="year" class="mb-1 block text-sm font-medium text-slate-700">
							Tahun Ajaran <span class="text-red-500">*</span>
						</label>
						<select
							id="year"
							bind:value={form.year}
							class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
						>
							<option value="">Pilih tahun ajaran</option>
							{#each academicYears as year}
								<option value={year.name}>
									{year.name}
									{#if year.isActive}(Aktif){/if}
								</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="description" class="mb-1 block text-sm font-medium text-slate-700">
							Deskripsi
						</label>
						<textarea
							id="description"
							bind:value={form.description}
							placeholder="Deskripsi singkat kurikulum..."
							rows="3"
							class="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
						></textarea>
					</div>

					<div class="flex gap-2">
						<button
							type="submit"
							disabled={submitting}
							class="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
						>
							{submitting ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
						</button>
						{#if isEditing}
							<button
								type="button"
								on:click={resetForm}
								class="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
							>
								Batal
							</button>
						{/if}
					</div>
				</form>
			</div>
		</div>

		<!-- List Section -->
		<div class="lg:col-span-2">
			<div class="rounded-lg border border-slate-200 bg-white">
				<div class="border-b border-slate-100 px-5 py-4">
					<h2 class="text-lg font-semibold text-slate-800">Daftar Kurikulum</h2>
				</div>

				{#if loading}
					<div class="flex items-center justify-center py-12">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500"
						></div>
					</div>
				{:else if curricula.length === 0}
					<div class="py-12 text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"
						>
							<svg
								class="h-6 w-6 text-slate-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
						<p class="text-sm text-slate-500">Belum ada data kurikulum</p>
						<p class="mt-1 text-xs text-slate-400">
							Tambahkan kurikulum menggunakan form di samping
						</p>
					</div>
				{:else}
					<div class="divide-y divide-slate-100">
						{#each curricula as curriculum}
							<div class="flex items-center justify-between px-5 py-4">
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2">
										<h3 class="font-medium text-slate-800">{curriculum.name}</h3>
										<span class="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
											{curriculum.code}
										</span>
										{#if curriculum.isActive}
											<span class="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
												Aktif
											</span>
										{/if}
									</div>
									<p class="mt-0.5 text-sm text-slate-500">
										Tahun: {curriculum.year}
										{#if curriculum.description}
											<span class="mx-1">•</span>
											{curriculum.description}
										{/if}
									</p>
								</div>
								<div class="ml-4 flex items-center gap-1">
									<button
										on:click={() => toggleActive(curriculum)}
										class="rounded p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
										title={curriculum.isActive ? 'Nonaktifkan' : 'Aktifkan'}
									>
										{#if curriculum.isActive}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										{:else}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										{/if}
									</button>
									<button
										on:click={() => editCurriculum(curriculum)}
										class="rounded p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
										title="Edit"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
									</button>
									<button
										on:click={() => deleteCurriculum(curriculum.id)}
										class="rounded p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
										title="Hapus"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
