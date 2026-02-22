<script lang="ts">
	import { page } from '$app/state';
	import { API_FETCH } from '$lib/api';
	import { onMount } from 'svelte';

	// Same subcategory map as parent page - static labels
	const SUBCATEGORIES: Record<number, { name: string; items: string[] }> = {
		1: {
			name: 'Tanah dan Bangunan',
			items: ['Tanah', 'Gedung Ruang Kelas', 'Gedung Kantor', 'Fasilitas Umum']
		},
		2: {
			name: 'Peralatan Elektronik & Teknologi (TIK)',
			items: [
				'Komputer & Laptop',
				'Proyektor (LCD)',
				'Server & Jaringan',
				'Printer & Fotokopi',
				'Sistem Suara'
			]
		},
		3: {
			name: 'Mebel (Furniture)',
			items: ['Meja & Kursi Siswa', 'Meja & Kursi Kerja', 'Lemari & Rak', 'Papan Tulis']
		},
		4: {
			name: 'Peralatan Laboratorium & Praktik',
			items: ['Alat Peraga Pendidikan', 'Alat Olahraga', 'Alat Kesenian']
		},
		5: {
			name: 'Kendaraan Operasional',
			items: ['Bus/Mobil Sekolah', 'Sepeda Motor']
		},
		6: {
			name: 'Aset Tetap Lainnya',
			items: ['Koleksi Perpustakaan', 'Alat Kebersihan & Perawatan']
		}
	};

	interface BuildingAsset {
		id: number;
		name: string;
		categoryId: number;
		subcategory: string;
		condition: string;
		quantity: number;
		acquisitionYear: number | null;
		acquisitionValue: number | null;
		location: string | null;
		registrationNumber: string | null;
		description: string | null;
		status: string;
		createdAt: number;
		updatedAt: number;
	}

	// Parse route param: "1-0" -> categoryId=1, itemIndex=0
	let categoryId = 0;
	let itemIndex = 0;
	let categoryName = '';
	let subcategoryName = '';

	$: {
		const parts = $page.params.id.split('-');
		categoryId = parseInt(parts[0]);
		itemIndex = parseInt(parts[1]);
		const cat = SUBCATEGORIES[categoryId];
		categoryName = cat?.name || '';
		subcategoryName = cat?.items[itemIndex] || '';
	}

	let assets: BuildingAsset[] = [];
	let loading = true;
	let submitting = false;
	let error = '';
	let success = '';

	// Form state
	let isEditing = false;
	let editId: number | null = null;
	let form = {
		name: '',
		condition: 'baik',
		quantity: 1,
		acquisitionYear: null as number | null,
		acquisitionValue: null as number | null,
		location: '',
		registrationNumber: '',
		description: ''
	};

	function resetForm() {
		form = {
			name: '',
			condition: 'baik',
			quantity: 1,
			acquisitionYear: null,
			acquisitionValue: null,
			location: '',
			registrationNumber: '',
			description: ''
		};
		isEditing = false;
		editId = null;
	}

	function editAsset(asset: BuildingAsset) {
		isEditing = true;
		editId = asset.id;
		form = {
			name: asset.name,
			condition: asset.condition,
			quantity: asset.quantity,
			acquisitionYear: asset.acquisitionYear,
			acquisitionValue: asset.acquisitionValue,
			location: asset.location || '',
			registrationNumber: asset.registrationNumber || '',
			description: asset.description || ''
		};
		document.getElementById('asset-form')?.scrollIntoView({ behavior: 'smooth' });
	}

	async function fetchAssets() {
		loading = true;
		error = '';
		try {
			const encoded = encodeURIComponent(subcategoryName);
			const response = await API_FETCH(
				`/routes/api/buildings-school/category/${categoryId}/sub/${encoded}`
			);
			if (!response.ok) throw new Error('Failed to load');
			assets = await response.json();
		} catch (e) {
			error = 'Gagal memuat data aset';
		} finally {
			loading = false;
		}
	}

	async function handleSubmit() {
		if (!form.name.trim()) {
			error = 'Nama aset wajib diisi';
			return;
		}

		submitting = true;
		error = '';
		success = '';

		try {
			const url = isEditing
				? `/routes/api/buildings-school/${editId}`
				: '/routes/api/buildings-school';
			const method = isEditing ? 'PUT' : 'POST';

			const payload = {
				...form,
				categoryId,
				subcategory: subcategoryName,
				acquisitionYear: form.acquisitionYear || null,
				acquisitionValue: form.acquisitionValue || null,
				location: form.location || null,
				registrationNumber: form.registrationNumber || null,
				description: form.description || null
			};

			const response = await API_FETCH(url, {
				method,
				body: JSON.stringify(payload)
			});

			if (!response.ok) throw new Error('Failed to save');

			success = isEditing ? 'Aset berhasil diperbarui' : 'Aset berhasil ditambahkan';
			resetForm();
			await fetchAssets();
		} catch (e) {
			error = 'Gagal menyimpan data aset';
		} finally {
			submitting = false;
		}
	}

	async function deleteAsset(id: number) {
		if (!confirm('Yakin ingin menghapus aset ini?')) return;

		try {
			const response = await API_FETCH(`/routes/api/buildings-school/${id}`, {
				method: 'DELETE'
			});
			if (!response.ok) throw new Error('Failed to delete');
			success = 'Aset berhasil dihapus';
			if (editId === id) resetForm();
			await fetchAssets();
		} catch (e) {
			error = 'Gagal menghapus aset';
		}
	}

	function formatCurrency(value: number | null): string {
		if (!value) return '-';
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
	}

	function conditionLabel(c: string): string {
		const map: Record<string, string> = {
			baik: 'Baik',
			rusak_ringan: 'Rusak Ringan',
			rusak_berat: 'Rusak Berat'
		};
		return map[c] || c;
	}

	function conditionColor(c: string): string {
		const map: Record<string, string> = {
			baik: 'bg-green-100 text-green-700',
			rusak_ringan: 'bg-yellow-100 text-yellow-700',
			rusak_berat: 'bg-red-100 text-red-700'
		};
		return map[c] || 'bg-slate-100 text-slate-600';
	}

	onMount(() => {
		if (subcategoryName) fetchAssets();
	});
</script>

<div class="space-y-6 p-6">
	<!-- Header -->
	<div>
		<button
			on:click={() => history.back()}
			class="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Kembali
		</button>
		<h1 class="text-4xl font-bold text-blue-700">{subcategoryName}</h1>
		<p class="mt-1 text-sm text-slate-500">{categoryName}</p>
	</div>

	<!-- Alerts -->
	{#if error}
		<div class="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
			<p class="text-sm text-red-600">{error}</p>
			<button
				on:click={() => (error = '')}
				class="text-red-400 hover:text-red-600"
				aria-label="Close"
			>
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
			<button
				on:click={() => (success = '')}
				class="text-green-400 hover:text-green-600"
				aria-label="Close"
			>
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
			<div id="asset-form" class="rounded-xl border border-slate-200 bg-white p-5">
				<h2 class="mb-4 text-lg font-semibold text-slate-800">
					{isEditing ? 'Edit Aset' : 'Tambah Aset'}
				</h2>

				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					<div>
						<label for="name" class="mb-1 block text-sm font-medium text-slate-700">
							Nama Aset <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							bind:value={form.name}
							placeholder="Contoh: Gedung Utama Lantai 1"
							class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
						/>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="condition" class="mb-1 block text-sm font-medium text-slate-700">
								Kondisi
							</label>
							<select
								id="condition"
								bind:value={form.condition}
								class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
							>
								<option value="baik">Baik</option>
								<option value="rusak_ringan">Rusak Ringan</option>
								<option value="rusak_berat">Rusak Berat</option>
							</select>
						</div>
						<div>
							<label for="quantity" class="mb-1 block text-sm font-medium text-slate-700">
								Jumlah
							</label>
							<input
								type="number"
								id="quantity"
								bind:value={form.quantity}
								min="1"
								class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
							/>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="acquisitionYear" class="mb-1 block text-sm font-medium text-slate-700">
								Tahun Perolehan
							</label>
							<input
								type="number"
								id="acquisitionYear"
								bind:value={form.acquisitionYear}
								placeholder="2024"
								min="1900"
								max="2099"
								class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
							/>
						</div>
						<div>
							<label for="acquisitionValue" class="mb-1 block text-sm font-medium text-slate-700">
								Nilai (Rp)
							</label>
							<input
								type="number"
								id="acquisitionValue"
								bind:value={form.acquisitionValue}
								placeholder="0"
								min="0"
								class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
							/>
						</div>
					</div>

					<div>
						<label for="location" class="mb-1 block text-sm font-medium text-slate-700">
							Lokasi
						</label>
						<input
							type="text"
							id="location"
							bind:value={form.location}
							placeholder="Contoh: Blok A, Lantai 2"
							class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="registrationNumber" class="mb-1 block text-sm font-medium text-slate-700">
							No. Inventaris
						</label>
						<input
							type="text"
							id="registrationNumber"
							bind:value={form.registrationNumber}
							placeholder="Contoh: INV-BNG-001"
							class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="description" class="mb-1 block text-sm font-medium text-slate-700">
							Keterangan
						</label>
						<textarea
							id="description"
							bind:value={form.description}
							placeholder="Deskripsi singkat aset..."
							rows="2"
							class="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
						></textarea>
					</div>

					<div class="flex gap-2">
						<button
							type="submit"
							disabled={submitting}
							class="flex-1 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
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
			<div class="rounded-xl border border-slate-200 bg-white">
				<div class="border-b border-slate-100 px-5 py-4">
					<h2 class="text-lg font-semibold text-slate-800">
						Daftar {subcategoryName}
					</h2>
					<p class="text-xs text-slate-400">{assets.length} item terdaftar</p>
				</div>

				{#if loading}
					<div class="flex items-center justify-center py-12">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500"
						></div>
					</div>
				{:else if assets.length === 0}
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
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								/>
							</svg>
						</div>
						<p class="text-sm text-slate-500">Belum ada data aset</p>
						<p class="mt-1 text-xs text-slate-400">Tambahkan aset menggunakan form di samping</p>
					</div>
				{:else}
					<div class="divide-y divide-slate-100">
						{#each assets as asset (asset.id)}
							<div class="flex items-start justify-between px-5 py-4">
								<div class="min-w-0 flex-1">
									<div class="flex flex-wrap items-center gap-2">
										<h3 class="font-medium text-slate-800">{asset.name}</h3>
										<span class="rounded px-2 py-0.5 text-xs {conditionColor(asset.condition)}">
											{conditionLabel(asset.condition)}
										</span>
										{#if asset.status !== 'aktif'}
											<span class="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
												{asset.status}
											</span>
										{/if}
									</div>
									<div class="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-500">
										<span>Qty: {asset.quantity}</span>
										{#if asset.location}
											<span>{asset.location}</span>
										{/if}
										{#if asset.registrationNumber}
											<span>{asset.registrationNumber}</span>
										{/if}
									</div>
									<div class="mt-0.5 flex flex-wrap gap-x-4 text-xs text-slate-400">
										{#if asset.acquisitionYear}
											<span>Tahun: {asset.acquisitionYear}</span>
										{/if}
										{#if asset.acquisitionValue}
											<span>Nilai: {formatCurrency(asset.acquisitionValue)}</span>
										{/if}
									</div>
									{#if asset.description}
										<p class="mt-1 text-xs text-slate-400">{asset.description}</p>
									{/if}
								</div>
								<div class="ml-4 flex items-center gap-1">
									<button
										on:click={() => editAsset(asset)}
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
										on:click={() => deleteAsset(asset.id)}
										class="rounded p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
										title="Hapus"
										aria-labelledby="Hapus"
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
