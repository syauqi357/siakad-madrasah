<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import PhoneInput from '$lib/components/input/PhoneInput.svelte';
	import ParentBiodata from '$lib/components/layout/parentBiodata.svelte';
	import Arrow_Left from '$lib/components/icons/arrow_left.svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';

	// Form Data State
	let formData = {
		studentName: '',
		nisn: '',
		localNis: '',
		idCardNumber: '',
		birthCertificateNumber: '',
		gender: '',
		birthPlace: '',
		birthDate: '',
		childOrder: '',
		siblingsCount: '',
		nationality: 'Indonesia',
		religion: '',
		phoneNumber: '',
		address: {
			street: '',
			houseNumber: '',
			rt: '',
			rw: '',
			village: '',
			subDistrict: '',
			district: '',
			regency: '',
			province: '',
			postalCode: ''
		},
		previousSchool: '',
		livingWith: '',
		transportation: '',
		bpjs: '',
		originRegion: '',
		profilePhoto: null as string | null,
		father: {
			name: '',
			nik: '',
			job: '',
			phone: '',
			birthPlace: '',
			birthDate: '',
			birthYear: '',
			education: '',
			monthlyIncome: '',
			isAlive: '1'
		},
		mother: {
			name: '',
			nik: '',
			job: '',
			phone: '',
			birthPlace: '',
			birthDate: '',
			birthYear: '',
			education: '',
			monthlyIncome: '',
			isAlive: '1'
		}
	};

	let activeTab = 'student';
	let isLoading = false;
	let isFetching = true;
	let errorMessage = '';

	// Photo upload state
	let selectedPhoto: File | null = null;
	let photoPreview: string | null = null;
	let existingPhotoUrl: string | null = null;

	// Modal Alert State
	let showAlert = false;
	let alertType: 'success' | 'error' | 'warning' | 'info' = 'success';
	let alertMessage = '';

	const studentId = $page.params.id;

	onMount(async () => {
		try {
			const response = await API_FETCH(`/routes/api/studentDataSet/${studentId}`);

			if (!response.ok) {
				throw new Error('Gagal memuat data siswa');
			}

			const data = await response.json();

			// Map API response to form data
			formData = {
				studentName: data.studentName || '',
				nisn: data.nisn?.toString() || '',
				localNis: data.localNis?.toString() || '',
				idCardNumber: data.idCardNumber || '',
				birthCertificateNumber: data.birthCertificateNumber || '',
				gender: data.gender === 'laki-laki' ? 'L' : data.gender === 'Perempuan' ? 'P' : '',
				birthPlace: data.birthPlace || '',
				birthDate: data.birthDate || '',
				childOrder: data.childOrder?.toString() || '',
				siblingsCount: data.siblingsCount?.toString() || '',
				nationality: data.nationality || 'Indonesia',
				religion: data.religion || '',
				phoneNumber: data.phoneNumber || '',
				address: {
					street: data.address?.street || '',
					houseNumber: data.address?.houseNumber || '',
					rt: data.address?.rt || '',
					rw: data.address?.rw || '',
					village: data.address?.village || '',
					subDistrict: data.address?.subDistrict || '',
					district: data.address?.district || '',
					regency: data.address?.regency || '',
					province: data.address?.province || '',
					postalCode: data.address?.postalCode || ''
				},
				previousSchool: data.previousSchool || '',
				livingWith: data.livingWith || '',
				transportation: data.transportation || '',
				bpjs: data.bpjs || '',
				originRegion: data.originRegion || '',
				profilePhoto: data.profilePhoto || null,
				father: {
					name: data.father?.name || '',
					nik: data.father?.nik || '',
					job: data.father?.occupation || '',
					phone: data.father?.phoneNumber || '',
					birthPlace: data.father?.birthPlace || '',
					birthDate: data.father?.birthDate || '',
					birthYear: data.father?.birthYear || '',
					education: data.father?.education || '',
					monthlyIncome: data.father?.monthlyIncome || '',
					isAlive: data.father?.isAlive?.toString() || '1'
				},
				mother: {
					name: data.mother?.name || '',
					nik: data.mother?.nik || '',
					job: data.mother?.occupation || '',
					phone: data.mother?.phoneNumber || '',
					birthPlace: data.mother?.birthPlace || '',
					birthDate: data.mother?.birthDate || '',
					birthYear: data.mother?.birthYear || '',
					education: data.mother?.education || '',
					monthlyIncome: data.mother?.monthlyIncome || '',
					isAlive: data.mother?.isAlive?.toString() || '1'
				}
			};

			// Set existing photo URL for preview
			if (data.profilePhoto) {
				existingPhotoUrl = `${import.meta.env.VITE_API_URL}${data.profilePhoto}`;
			}
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
			alertType = 'error';
			alertMessage = errorMessage;
			showAlert = true;
		} finally {
			isFetching = false;
		}
	});

	function handlePhotoSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				alertType = 'error';
				alertMessage = 'Ukuran file maksimal 2MB';
				showAlert = true;
				input.value = '';
				return;
			}

			if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
				alertType = 'error';
				alertMessage = 'Hanya file gambar (JPG, PNG, WEBP) yang diizinkan';
				showAlert = true;
				input.value = '';
				return;
			}

			selectedPhoto = file;
			photoPreview = URL.createObjectURL(file);
		}
	}

	async function uploadPhotoToServer(): Promise<boolean> {
		if (!selectedPhoto) return true;

		try {
			const formDataPhoto = new FormData();
			formDataPhoto.append('photo', selectedPhoto);

			const response = await API_FETCH(`/routes/api/students/${studentId}/photo`, {
				method: 'POST',
				body: formDataPhoto
			});

			return response.ok;
		} catch (error) {
			console.error('Error uploading photo:', error);
			return false;
		}
	}

	function handleAlertConfirm() {
		if (alertType === 'success') {
			goto(`/siswa/${studentId}`);
		}
		showAlert = false;
	}

	const handleSubmit = async () => {
		isLoading = true;
		errorMessage = '';

		try {
			let genderPayload = formData.gender;
			if (formData.gender === 'L') {
				genderPayload = 'laki-laki';
			} else if (formData.gender === 'P') {
				genderPayload = 'Perempuan';
			}

			const payload = {
				studentName: formData.studentName,
				nisn: formData.nisn,
				localNis: formData.localNis,
				idCardNumber: formData.idCardNumber,
				birthCertificateNumber: formData.birthCertificateNumber,
				gender: genderPayload,
				birthPlace: formData.birthPlace,
				birthDate: formData.birthDate,
				childOrder: formData.childOrder,
				siblingsCount: formData.siblingsCount,
				nationality: formData.nationality,
				religion: formData.religion,
				phoneNumber: formData.phoneNumber,
				previousSchool: formData.previousSchool,
				livingWith: formData.livingWith,
				transportation: formData.transportation,
				bpjs: formData.bpjs,
				originRegion: formData.originRegion,
				address: formData.address,
				father: formData.father,
				mother: formData.mother
			};

			const response = await API_FETCH(`/routes/api/students/${studentId}`, {
				method: 'PUT',
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				// Upload photo if new one selected
				if (selectedPhoto) {
					const photoUploaded = await uploadPhotoToServer();
					if (!photoUploaded) {
						alertType = 'warning';
						alertMessage = 'Data siswa berhasil diperbarui, tetapi foto gagal diupload.';
						showAlert = true;
						return;
					}
				}

				alertType = 'success';
				alertMessage = 'Data siswa berhasil diperbarui!';
				showAlert = true;
			} else {
				const result = await response.json();
				errorMessage = result.message || 'Gagal memperbarui data siswa';
				alertType = 'error';
				alertMessage = errorMessage;
				showAlert = true;
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			errorMessage = 'Terjadi kesalahan sistem';
			alertType = 'error';
			alertMessage = errorMessage;
			showAlert = true;
		} finally {
			isLoading = false;
		}
	};

	const onlyNumbers = (e: Event) => {
		const target = e.target as HTMLInputElement;
		target.value = target.value.replace(/[^0-9]/g, '');
	};
</script>

<ModalAlert
	bind:show={showAlert}
	type={alertType}
	message={alertMessage}
	confirmText={alertType === 'success' ? 'Lanjut' : 'OK'}
	on:confirm={handleAlertConfirm}
/>

<div class="min-h-screen bg-slate-50 p-4 md:p-8">
	<div class="mx-auto max-w-5xl">
		<a
			href="/siswa/{studentId}"
			class="my-4 flex w-fit cursor-pointer items-center justify-center gap-3 rounded-md bg-blue-600 px-4 py-1 text-xs text-blue-100 capitalize hover:bg-blue-700 md:text-sm"
		>
			<Arrow_Left /> kembali
		</a>

		<div class="mb-8">
			<h1 class="text-3xl font-bold text-slate-800">Edit Data Siswa</h1>
			<p class="mt-2 text-sm text-slate-600">
				Perbarui data siswa sesuai dengan dokumen resmi (KK/Akta).
			</p>
		</div>

		{#if isFetching}
			<div class="flex h-64 items-center justify-center rounded-lg bg-white shadow-lg">
				<div
					class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
				></div>
			</div>
		{:else}
			<div class="mb-8 border-b border-slate-200">
				<nav class="-mb-px flex space-x-2" aria-label="Tabs">
					<button
						on:click={() => (activeTab = 'student')}
						class="border-b-2 px-1 py-4 text-xs font-medium whitespace-nowrap transition-colors md:text-sm {activeTab ===
						'student'
							? 'border-blue-500 font-semibold text-blue-600'
							: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
					>
						Data Siswa
					</button>
					<button
						on:click={() => (activeTab = 'parents')}
						class="border-b-2 px-1 py-4 text-xs font-medium whitespace-nowrap transition-colors md:text-sm {activeTab ===
						'parents'
							? 'border-blue-500 font-semibold text-blue-600'
							: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
					>
						Data Orang Tua
					</button>
				</nav>
			</div>

			<form class="space-y-8" on:submit|preventDefault={handleSubmit}>
				{#if activeTab === 'student'}
					<div class="space-y-8">
						<!-- Photo Section -->
						<div class="rounded-xl border border-slate-100 bg-white p-6">
							<h2 class="mb-4 text-lg font-semibold text-slate-800">Foto Profil</h2>
							<div class="flex items-center gap-6">
								{#if photoPreview}
									<div class="relative">
										<img
											src={photoPreview}
											alt="Preview"
											class="h-28 w-24 rounded-lg border-2 border-blue-300 object-cover"
										/>
										<button
											type="button" aria-labelledby="select Photo Preview"
											on:click={() => {
												selectedPhoto = null;
												photoPreview = null;
											}}
											class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
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
								{:else if existingPhotoUrl}
									<img
										src={existingPhotoUrl}
										alt="Foto saat ini"
										class="h-28 w-24 rounded-lg border-2 border-slate-300 object-cover"
									/>
								{:else}
									<div
										class="flex h-28 w-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
								{/if}
								<div class="flex-1">
									<input
										type="file"
										accept="image/jpeg,image/jpg,image/png,image/webp"
										on:change={handlePhotoSelect}
										class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
									/>
									<p class="mt-1 text-xs text-slate-500">Format: JPG, PNG, WEBP. Maksimal 2MB.</p>
								</div>
							</div>
						</div>

						<!-- Section 1: Identity -->
						<div class="rounded-xl border border-slate-100 bg-white p-6">
							<h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
								<span
									class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600"
									>1</span
								>
								Identitas & Kelahiran
							</h2>

							<div class="grid gap-6 md:grid-cols-2">
								<div class="relative w-full md:col-span-2">
									<input
										type="text"
										id="studentName"
										bind:value={formData.studentName}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="studentName"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Nama Lengkap Siswa</label
									>
								</div>

								<div class="relative w-full">
									<input
										type="text"
										id="nisn"
										bind:value={formData.nisn}
										on:input={onlyNumbers}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="nisn"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>NISN</label
									>
								</div>

								<div class="relative w-full">
									<input
										type="text"
										id="localNis"
										bind:value={formData.localNis}
										on:input={onlyNumbers}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="localNis"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>NIS Lokal</label
									>
								</div>

								<div class="relative w-full">
									<input
										type="text"
										id="idCardNumber"
										bind:value={formData.idCardNumber}
										on:input={onlyNumbers}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="idCardNumber"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>NIK / No. KTP</label
									>
								</div>

								<div class="relative w-full">
									<input
										type="text"
										id="birthCertificateNumber"
										bind:value={formData.birthCertificateNumber}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="birthCertificateNumber"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>No. Akta Kelahiran</label
									>
								</div>

								<div class="relative w-full">
									<input
										type="text"
										id="birthPlace"
										bind:value={formData.birthPlace}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="birthPlace"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Tempat Lahir</label
									>
								</div>

								<div class="relative w-full">
									<input
										type="date"
										id="birthDate"
										bind:value={formData.birthDate}
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="birthDate"
										class="absolute -top-2 left-2.5 z-10 cursor-text bg-white px-1 text-xs text-slate-400 transition-all duration-100 peer-focus:text-blue-500"
										>Tanggal Lahir</label
									>
								</div>

								<div class="md:col-span-2">
									<span class="mb-2 block text-sm text-slate-500">Jenis Kelamin</span>
									<div class="flex gap-4">
										<label
											class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:bg-slate-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700"
										>
											<input
												type="radio"
												name="gender"
												value="L"
												bind:group={formData.gender}
												class="h-4 w-4 text-blue-600 focus:ring-blue-500"
											/>
											<span class="text-sm font-medium">Laki-laki</span>
										</label>
										<label
											class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:bg-slate-50 has-[:checked]:border-pink-500 has-[:checked]:bg-pink-50 has-[:checked]:text-pink-700"
										>
											<input
												type="radio"
												name="gender"
												value="P"
												bind:group={formData.gender}
												class="h-4 w-4 text-pink-600 focus:ring-pink-500"
											/>
											<span class="text-sm font-medium">Perempuan</span>
										</label>
									</div>
								</div>

								<div class="relative w-full">
									<input
										type="text"
										id="nationality"
										bind:value={formData.nationality}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="nationality"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Kewarganegaraan</label
									>
								</div>

								<div class="relative w-full">
									<select
										id="religion"
										bind:value={formData.religion}
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									>
										<option value="" disabled>Pilih Agama</option>
										<option value="Islam">Islam</option>
										<option value="Kristen">Kristen</option>
										<option value="Katolik">Katolik</option>
										<option value="Hindu">Hindu</option>
										<option value="Buddha">Buddha</option>
										<option value="Khonghucu">Khonghucu</option>
									</select>
									<label
										for="religion"
										class="absolute -top-2 left-2.5 z-10 cursor-text bg-white px-1 text-xs text-slate-400 transition-all duration-100 peer-focus:text-blue-500"
										>Agama</label
									>
								</div>

								<div class="grid grid-cols-2 gap-4">
									<div class="relative w-full">
										<input
											type="number"
											id="childOrder"
											bind:value={formData.childOrder}
											placeholder=" "
											class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
										/>
										<label
											for="childOrder"
											class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
											>Anak ke-</label
										>
									</div>
									<div class="relative w-full">
										<input
											type="number"
											id="siblingsCount"
											bind:value={formData.siblingsCount}
											placeholder=" "
											class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
										/>
										<label
											for="siblingsCount"
											class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
											>Jml Saudara</label
										>
									</div>
								</div>
							</div>
						</div>

						<!-- Section 2: Contact & Address -->
						<div class="rounded-xl border border-slate-100 bg-white p-6">
							<h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
								<span
									class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600"
									>2</span
								>
								Kontak & Alamat
							</h2>

							<div class="grid gap-6 md:grid-cols-2">
								<div class="md:col-span-2">
									<PhoneInput bind:value={formData.phoneNumber} label="Nomor Telepon / WA Siswa" />
								</div>

								<div class="relative w-full md:col-span-2">
									<input
										type="text"
										id="street"
										bind:value={formData.address.street}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="street"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Nama Jalan</label
									>
								</div>

								<div class="grid grid-cols-3 gap-4 md:col-span-2">
									<div class="relative w-full">
										<input
											type="text"
											id="houseNumber"
											bind:value={formData.address.houseNumber}
											placeholder=" "
											class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
										/>
										<label
											for="houseNumber"
											class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
											>No. Rumah</label
										>
									</div>
									<div class="relative w-full">
										<input
											type="text"
											id="rt"
											bind:value={formData.address.rt}
											placeholder=" "
											class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
										/>
										<label
											for="rt"
											class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
											>RT</label
										>
									</div>
									<div class="relative w-full">
										<input
											type="text"
											id="rw"
											bind:value={formData.address.rw}
											placeholder=" "
											class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
										/>
										<label
											for="rw"
											class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
											>RW</label
										>
									</div>
								</div>

								<div class="relative w-full">
									<input
										type="text"
										id="village"
										bind:value={formData.address.village}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="village"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Desa / Kelurahan</label
									>
								</div>
								<div class="relative w-full">
									<input
										type="text"
										id="subDistrict"
										bind:value={formData.address.subDistrict}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="subDistrict"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Kecamatan</label
									>
								</div>
								<div class="relative w-full">
									<input
										type="text"
										id="regency"
										bind:value={formData.address.regency}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="regency"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Kabupaten / Kota</label
									>
								</div>
								<div class="relative w-full">
									<input
										type="text"
										id="province"
										bind:value={formData.address.province}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="province"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Provinsi</label
									>
								</div>
								<div class="relative w-full">
									<input
										type="text"
										id="postalCode"
										bind:value={formData.address.postalCode}
										on:input={onlyNumbers}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="postalCode"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Kode Pos</label
									>
								</div>
							</div>
						</div>

						<!-- Section 3: Additional Data -->
						<div class="rounded-xl border border-slate-100 bg-white p-6">
							<h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
								<span
									class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600"
									>3</span
								>
								Data Tambahan
							</h2>

							<div class="grid gap-6 md:grid-cols-2">
								<div class="relative w-full">
									<input
										type="text"
										id="previousSchool"
										bind:value={formData.previousSchool}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="previousSchool"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Sekolah Sebelumnya</label
									>
								</div>

								<div class="relative w-full">
									<input
										type="text"
										id="originRegion"
										bind:value={formData.originRegion}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="originRegion"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Asal Daerah</label
									>
								</div>

								<div class="relative w-full">
									<input
										type="text"
										id="bpjs"
										bind:value={formData.bpjs}
										on:input={onlyNumbers}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="bpjs"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>No. BPJS</label
									>
								</div>

								<div class="relative w-full">
									<select
										id="livingWith"
										bind:value={formData.livingWith}
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									>
										<option value="">Pilih...</option>
										<option value="Orang Tua">Orang Tua</option>
										<option value="Wali">Wali</option>
										<option value="Asrama">Asrama</option>
										<option value="Kos">Kos</option>
										<option value="Lainnya">Lainnya</option>
									</select>
									<label
										for="livingWith"
										class="absolute -top-2 left-2.5 z-10 cursor-text bg-white px-1 text-xs text-slate-400 transition-all duration-100 peer-focus:text-blue-500"
										>Tinggal Bersama</label
									>
								</div>

								<div class="relative w-full">
									<select
										id="transportation"
										bind:value={formData.transportation}
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									>
										<option value="">Pilih...</option>
										<option value="Jalan Kaki">Jalan Kaki</option>
										<option value="Sepeda">Sepeda</option>
										<option value="Sepeda Motor">Sepeda Motor</option>
										<option value="Antar Jemput">Antar Jemput</option>
										<option value="Angkutan Umum">Angkutan Umum</option>
										<option value="Lainnya">Lainnya</option>
									</select>
									<label
										for="transportation"
										class="absolute -top-2 left-2.5 z-10 cursor-text bg-white px-1 text-xs text-slate-400 transition-all duration-100 peer-focus:text-blue-500"
										>Transportasi</label
									>
								</div>
							</div>
						</div>
					</div>
				{:else if activeTab === 'parents'}
					<div class="animate-fade-in">
						<ParentBiodata bind:fatherData={formData.father} bind:motherData={formData.mother} />
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
					<a
						href="/siswa/{studentId}"
						class="rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-300"
					>
						Batal
					</a>
					<button
						type="submit"
						disabled={isLoading}
						class="rounded-md bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isLoading}
							<span class="flex items-center gap-2">
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Menyimpan...
							</span>
						{:else}
							Simpan Perubahan
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
