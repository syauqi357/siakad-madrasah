<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';

	const apiUrl = import.meta.env.VITE_API_URL;

	// Form state
	let isLoading = true;
	let isSaving = false;
	let isEditing = false;
	let isUploading = false;
	let hasData = false;
	let message = { type: '', text: '' };

	// Logo upload state
	let fileInput: HTMLInputElement;
	let logoPreview: string | null = null;
	let selectedFile: File | null = null;

	// Form data
	let formData = {
		name: '',
		npsn: '',
		nsm: '',
		akreditasi: 'B',
		alamat: '',
		kota: '',
		negara: 'Indonesia',
		logoUrl: ''
	};

	// Original data for cancel
	let originalData = { ...formData };

	const akreditasiOptions = ['A', 'B', 'C', 'Belum Terakreditasi'];

	onMount(async () => {
		await fetchSchoolData();
	});

	async function fetchSchoolData() {
		isLoading = true;
		message = { type: '', text: '' };

		try {
			const response = await API_FETCH('/routes/api/schoolData');

			if (response.ok) {
				const data = await response.json();
				formData = {
					name: data.name || '',
					npsn: data.npsn?.toString() || '',
					nsm: data.nsm?.toString() || '',
					akreditasi: data.akreditasi || 'B',
					alamat: data.alamat || '',
					kota: data.kota || '',
					negara: data.negara || 'Indonesia',
					logoUrl: data.logoUrl || ''
				};
				originalData = { ...formData };
				hasData = true;
				logoPreview = null;
				selectedFile = null;
			} else if (response.status === 404) {
				hasData = false;
				isEditing = true;
			}
		} catch (error) {
			console.error('Failed to fetch school data:', error);
			message = { type: 'error', text: 'Gagal memuat data sekolah' };
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;
		message = { type: '', text: '' };

		try {
			const method = hasData ? 'PUT' : 'POST';
			const response = await API_FETCH('/routes/api/schoolData', {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.name,
					npsn: formData.npsn,
					nsm: formData.nsm,
					akreditasi: formData.akreditasi,
					alamat: formData.alamat,
					kota: formData.kota,
					negara: formData.negara
				})
			});

			if (response.ok) {
				message = {
					type: 'success',
					text: hasData ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!'
				};
				hasData = true;
				isEditing = false;
				originalData = { ...formData };
				await fetchSchoolData();
			} else {
				const err = await response.json();
				message = { type: 'error', text: err.error || 'Gagal menyimpan data' };
			}
		} catch (error) {
			console.error('Failed to save school data:', error);
			message = { type: 'error', text: 'Terjadi kesalahan saat menyimpan' };
		} finally {
			isSaving = false;
		}
	}

	function handleCancel() {
		formData = { ...originalData };
		isEditing = false;
		logoPreview = null;
		selectedFile = null;
		message = { type: '', text: '' };
	}

	function startEditing() {
		isEditing = true;
		message = { type: '', text: '' };
	}

	// Logo upload functions
	function triggerFileInput() {
		fileInput?.click();
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			message = {
				type: 'error',
				text: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, SVG, atau WebP.'
			};
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			message = { type: 'error', text: 'Ukuran file maksimal 5MB.' };
			return;
		}

		selectedFile = file;

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			logoPreview = e.target?.result as string;
		};
		reader.readAsDataURL(file);

		message = { type: '', text: '' };
	}

	async function uploadLogo() {
		if (!selectedFile) return;

		isUploading = true;
		message = { type: '', text: '' };

		try {
			const formDataUpload = new FormData();
			formDataUpload.append('logo', selectedFile);

			const response = await fetch(`${apiUrl}/routes/api/schoolData/logo`, {
				method: 'POST',
				body: formDataUpload,
				credentials: 'include'
			});

			if (response.ok) {
				const result = await response.json();
				formData.logoUrl = result.logoUrl;
				originalData.logoUrl = result.logoUrl;
				logoPreview = null;
				selectedFile = null;
				message = { type: 'success', text: 'Logo berhasil diupload!' };
			} else {
				const err = await response.json();
				message = { type: 'error', text: err.error || 'Gagal mengupload logo' };
			}
		} catch (error) {
			console.error('Failed to upload logo:', error);
			message = { type: 'error', text: 'Terjadi kesalahan saat mengupload' };
		} finally {
			isUploading = false;
		}
	}

	function cancelLogoSelection() {
		logoPreview = null;
		selectedFile = null;
		if (fileInput) fileInput.value = '';
	}

	// Get current logo source
	$: currentLogoSrc = logoPreview || (formData.logoUrl ? `${apiUrl}${formData.logoUrl}` : null);
</script>

<div class="min-h-screen p-4 md:p-6">
	<!-- Header -->
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-blue-600">Profil Lembaga</h1>
		<p class="mt-1 text-sm text-gray-500">Kelola informasi dasar sekolah/madrasah</p>
	</div>

	<!-- Message Alert -->
	{#if message.text}
		<div
			class="mb-4 rounded-lg px-4 py-3 text-sm {message.type === 'success'
				? 'border border-green-200 bg-green-50 text-green-700'
				: 'border border-red-200 bg-red-50 text-red-700'}"
		>
			{message.text}
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading}
		<div class="rounded-xl border border-gray-200 bg-white p-8">
			<div class="flex flex-col items-center justify-center gap-3">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"
				></div>
				<p class="text-sm text-gray-500">Memuat data...</p>
			</div>
		</div>
	{:else}
		<!-- Main Card -->
		<div class="rounded-xl border border-gray-200 bg-white">
			<!-- Card Header -->
			<div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
				<div class="flex items-center gap-3">
					<!-- Logo Preview -->
					<div
						class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
					>
						{#if currentLogoSrc}
							<img src={currentLogoSrc} alt="Logo" class="h-full w-full object-contain" />
						{:else}
							<svg
								class="h-8 w-8 text-gray-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								/>
							</svg>
						{/if}
					</div>
					<div>
						<h2 class="font-semibold text-gray-800">
							{formData.name || 'Nama Sekolah'}
						</h2>
						<p class="text-xs text-gray-500">
							{#if formData.npsn}NPSN: {formData.npsn}{/if}
							{#if formData.npsn && formData.nsm}
								|
							{/if}
							{#if formData.nsm}NSM: {formData.nsm}{/if}
							{#if !formData.npsn && !formData.nsm}Belum ada data{/if}
						</p>
					</div>
				</div>

				{#if !isEditing && hasData}
					<button
						on:click={startEditing}
						class="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						Edit
					</button>
				{/if}
			</div>

			<!-- Form Content -->
			<form on:submit|preventDefault={handleSubmit} class="p-6">
				<div class="grid gap-6 md:grid-cols-2">
					<!-- Logo Upload Section -->
					<div class="md:col-span-2">
						<label class="mb-1.5 block text-sm font-medium text-gray-700">Logo Sekolah</label>
						<div class="flex flex-col gap-4 sm:flex-row sm:items-start">
							<!-- Logo Display -->
							<div
								class="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
							>
								{#if currentLogoSrc}
									<img
										src={currentLogoSrc}
										alt="Logo Preview"
										class="h-full w-full object-contain p-2"
									/>
									{#if logoPreview}
										<div class="absolute top-1 right-1">
											<span
												class="rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-700"
												>Preview</span
											>
										</div>
									{/if}
								{:else}
									<div class="text-center">
										<svg
											class="mx-auto h-10 w-10 text-gray-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="1.5"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<p class="mt-1 text-xs text-gray-400">Belum ada logo</p>
									</div>
								{/if}
							</div>

							<!-- Upload Controls -->
							<div class="flex flex-col gap-2">
								<input
									type="file"
									bind:this={fileInput}
									on:change={handleFileSelect}
									accept="image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
									class="hidden"
								/>

								{#if isEditing}
									{#if selectedFile}
										<!-- File selected - show upload/cancel buttons -->
										<div class="flex gap-2">
											<button
												type="button"
												on:click={uploadLogo}
												disabled={isUploading}
												class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
											>
												{#if isUploading}
													<div
														class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
													></div>
													Mengupload...
												{:else}
													<svg
														class="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
														/>
													</svg>
													Upload
												{/if}
											</button>
											<button
												type="button"
												on:click={cancelLogoSelection}
												disabled={isUploading}
												class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
											>
												Batal
											</button>
										</div>
										<p class="text-xs text-gray-500">
											File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
										</p>
									{:else}
										<!-- No file selected - show choose button -->
										<button
											type="button"
											on:click={triggerFileInput}
											class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											Pilih Logo
										</button>
									{/if}
									<p class="text-xs text-gray-500">Format: JPG, PNG, GIF, SVG, WebP. Maks 5MB.</p>
								{:else}
									<p class="text-sm text-gray-500">Klik Edit untuk mengubah logo</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Nama Sekolah -->
					<div class="md:col-span-2">
						<label for="name" class="mb-1.5 block text-sm font-medium text-gray-700">
							Nama Sekolah/Madrasah <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							bind:value={formData.name}
							disabled={!isEditing}
							required
							placeholder="Contoh: MTs. Al-Hasyimiy"
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
						/>
					</div>

					<!-- NPSN -->
					<div>
						<label for="npsn" class="mb-1.5 block text-sm font-medium text-gray-700">
							NPSN <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="npsn"
							bind:value={formData.npsn}
							disabled={!isEditing}
							required
							placeholder="8 digit NPSN"
							maxlength="20"
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
						/>
					</div>

					<!-- NSM -->
					<div>
						<label for="nsm" class="mb-1.5 block text-sm font-medium text-gray-700">
							NSM <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="nsm"
							bind:value={formData.nsm}
							disabled={!isEditing}
							required
							placeholder="Nomor Statistik Madrasah"
							maxlength="20"
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
						/>
					</div>

					<!-- Akreditasi -->
					<div>
						<label for="akreditasi" class="mb-1.5 block text-sm font-medium text-gray-700">
							Akreditasi <span class="text-red-500">*</span>
						</label>
						<select
							id="akreditasi"
							bind:value={formData.akreditasi}
							disabled={!isEditing}
							required
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
						>
							{#each akreditasiOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</div>

					<!-- Kota -->
					<div>
						<label for="kota" class="mb-1.5 block text-sm font-medium text-gray-700">
							Kota/Kabupaten <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="kota"
							bind:value={formData.kota}
							disabled={!isEditing}
							required
							placeholder="Contoh: Pasuruan"
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
						/>
					</div>

					<!-- Alamat -->
					<div class="md:col-span-2">
						<label for="alamat" class="mb-1.5 block text-sm font-medium text-gray-700">
							Alamat Lengkap <span class="text-red-500">*</span>
						</label>
						<textarea
							id="alamat"
							bind:value={formData.alamat}
							disabled={!isEditing}
							required
							rows="3"
							placeholder="Jalan, nomor, RT/RW, kelurahan, kecamatan"
							class="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
						></textarea>
					</div>

					<!-- Negara -->
					<div>
						<label for="negara" class="mb-1.5 block text-sm font-medium text-gray-700">
							Negara <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="negara"
							bind:value={formData.negara}
							disabled={!isEditing}
							required
							placeholder="Indonesia"
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
						/>
					</div>
				</div>

				<!-- Action Buttons -->
				{#if isEditing}
					<div class="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
						{#if hasData}
							<button
								type="button"
								on:click={handleCancel}
								disabled={isSaving}
								class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Batal
							</button>
						{/if}
						<button
							type="submit"
							disabled={isSaving}
							class="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isSaving}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Menyimpan...
							{:else}
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								{hasData ? 'Simpan Perubahan' : 'Simpan Data'}
							{/if}
						</button>
					</div>
				{/if}
			</form>
		</div>
	{/if}
</div>
