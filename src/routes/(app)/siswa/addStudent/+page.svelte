<script lang="ts">
	import PhoneInput from '$lib/components/input/PhoneInput.svelte';
	import ParentBiodata from '$lib/components/layout/parentBiodata.svelte';

	// Form Data State matching the Schema
	let formData = {
		// Identity
		studentName: '',
		nisn: '',
		localNis: '',
		idCardNumber: '', // NIK
		birthCertificateNumber: '', // No. Akta
		gender: '',

		// Birth Info
		birthPlace: '',
		birthDate: '',

		// Family Info
		childOrder: '',
		siblingsCount: '',
		nationality: 'Indonesia',
		religion: '',

		// Contact & Address
		phoneNumber: '',
		address: '',
		originRegion: '', // Asal Daerah

		// Additional Data
		previousSchool: '',
		livingWith: '',
		transportation: '',
		bpjs: '',
		profilePhoto: null,

		// Parent Data
		father: { name: '', nik: '', job: '', phone: '' },
		mother: { name: '', nik: '', job: '', phone: '' }
	};

	// Tab State
	let activeTab = 'student'; // 'student' | 'parents' | 'guardian'
</script>

<div class="min-h-screen bg-slate-50 p-4 md:p-8">
	<div class="mx-auto max-w-5xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-slate-800">Tambah Siswa Baru</h1>
			<p class="mt-2 text-slate-600">
				Lengkapi data siswa di bawah ini sesuai dengan dokumen resmi (KK/Akta).
			</p>
		</div>

		<!-- Tabs -->
		<div class="mb-8 overflow-x-auto border-b border-slate-200">
			<nav class="-mb-px flex space-x-8" aria-label="Tabs">
				<button
					on:click={() => (activeTab = 'student')}
					class="border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					'student'
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
				>
					Data Siswa
				</button>
				<button
					on:click={() => (activeTab = 'parents')}
					class="border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					'parents'
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
				>
					Data Orang Tua
				</button>
				<button
					on:click={() => (activeTab = 'guardian')}
					class="border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					'guardian'
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
				>
					Data Wali (Opsional)
				</button>
			</nav>
		</div>

		<form class="space-y-8">
			<!-- Tab Content: Student Data -->
			{#if activeTab === 'student'}
				<div class="animate-fade-in space-y-8">
					<!-- Section 0: Foto Profil -->
					<div class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
						<h2 class="mb-4 text-lg font-semibold text-slate-800">Foto Profil</h2>
						<div class="flex items-center gap-6">
							<div
								class="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400"
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
							<div class="flex-1">
								<input
									type="file"
									accept="image/*"
									class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
								/>
								<p class="mt-1 text-xs text-slate-500">Format: JPG, PNG. Maksimal 2MB.</p>
							</div>
						</div>
					</div>

					<!-- Section 1: Identitas & Kelahiran -->
					<div class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
						<h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600"
								>1</span
							>
							Identitas & Kelahiran
						</h2>

						<div class="grid gap-6 md:grid-cols-2">
							<!-- Nama Siswa -->
							<div class="relative w-full md:col-span-2">
								<input
									type="text"
									id="studentName"
									bind:value={formData.studentName}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="studentName"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Nama Lengkap Siswa</label
								>
							</div>

							<!-- NISN -->
							<div class="relative w-full">
								<input
									type="text"
									id="nisn"
									bind:value={formData.nisn}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="nisn"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>NISN</label
								>
							</div>

							<!-- NIS Lokal -->
							<div class="relative w-full">
								<input
									type="text"
									id="localNis"
									bind:value={formData.localNis}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="localNis"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>NIS Lokal</label
								>
							</div>

							<!-- NIK -->
							<div class="relative w-full">
								<input
									type="text"
									id="idCardNumber"
									bind:value={formData.idCardNumber}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="idCardNumber"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>NIK / No. KTP</label
								>
							</div>

							<!-- No Akta -->
							<div class="relative w-full">
								<input
									type="text"
									id="birthCertificateNumber"
									bind:value={formData.birthCertificateNumber}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="birthCertificateNumber"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>No. Akta Kelahiran</label
								>
							</div>

							<!-- Tempat Lahir -->
							<div class="relative w-full">
								<input
									type="text"
									id="birthPlace"
									bind:value={formData.birthPlace}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="birthPlace"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Tempat Lahir</label
								>
							</div>

							<!-- Tanggal Lahir -->
							<div class="relative w-full">
								<input
									type="date"
									id="birthDate"
									bind:value={formData.birthDate}
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="birthDate"
									class="absolute -top-2 left-2.5 z-10 cursor-text bg-white px-1 text-xs text-slate-400 transition-all duration-300 peer-focus:text-blue-500"
									>Tanggal Lahir</label
								>
							</div>

							<!-- Jenis Kelamin (Radio) -->
							<div class="md:col-span-2">
								<span class="mb-2 block text-sm text-slate-500">Jenis Kelamin</span>
								<div class="flex gap-4">
									<label
										class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:bg-slate-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700"
									>
										<input
											type="radio"
											name="gender"
											value="laki-laki"
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
											value="perempuan"
											bind:group={formData.gender}
											class="h-4 w-4 text-pink-600 focus:ring-pink-500"
										/>
										<span class="text-sm font-medium">Perempuan</span>
									</label>
								</div>
							</div>

							<!-- Kewarganegaraan -->
							<div class="relative w-full">
								<input
									type="text"
									id="nationality"
									bind:value={formData.nationality}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="nationality"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Kewarganegaraan</label
								>
							</div>

							<!-- Anak ke & Saudara -->
							<div class="grid grid-cols-2 gap-4">
								<div class="relative w-full">
									<input
										type="number"
										id="childOrder"
										bind:value={formData.childOrder}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="childOrder"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Anak ke-</label
									>
								</div>
								<div class="relative w-full">
									<input
										type="number"
										id="siblingsCount"
										bind:value={formData.siblingsCount}
										placeholder=" "
										class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
									/>
									<label
										for="siblingsCount"
										class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
										>Jml Saudara</label
									>
								</div>
							</div>
						</div>
					</div>

					<!-- Section 2: Kontak & Alamat -->
					<div class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
						<h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600"
								>2</span
							>
							Kontak & Alamat
						</h2>

						<div class="grid gap-6 md:grid-cols-2">
							<!-- Phone Number (Component) -->
							<div class="md:col-span-2">
								<PhoneInput bind:value={formData.phoneNumber} label="Nomor Telepon / WA Siswa" />
							</div>

							<!-- Alamat Lengkap -->
							<div class="relative w-full md:col-span-2">
								<textarea
									id="address"
									bind:value={formData.address}
									rows="3"
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								></textarea>
								<label
									for="address"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Alamat Lengkap (Jalan, RT/RW, Kelurahan, Kecamatan)</label
								>
							</div>

							<!-- Asal Daerah -->
							<div class="relative w-full">
								<input
									type="text"
									id="originRegion"
									bind:value={formData.originRegion}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="originRegion"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Asal Daerah (Kota/Kab)</label
								>
							</div>

							<!-- Tinggal Bersama -->
							<div class="relative w-full">
								<select
									id="livingWith"
									bind:value={formData.livingWith}
									class="peer ease w-full appearance-none rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								>
									<option value="" disabled selected></option>
									<option value="orang_tua">Orang Tua</option>
									<option value="wali">Wali</option>
									<option value="asrama">Asrama</option>
									<option value="kost">Kost</option>
									<option value="lainnya">Lainnya</option>
								</select>
								<label
									for="livingWith"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Tinggal Bersama</label
								>
								<div
									class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/></svg
									>
								</div>
							</div>
						</div>
					</div>

					<!-- Section 3: Data Penunjang -->
					<div class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
						<h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600"
								>3</span
							>
							Data Penunjang
						</h2>

						<div class="grid gap-6 md:grid-cols-2">
							<!-- Sekolah Sebelumnya -->
							<div class="relative w-full md:col-span-2">
								<input
									type="text"
									id="previousSchool"
									bind:value={formData.previousSchool}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="previousSchool"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Sekolah Sebelumnya</label
								>
							</div>

							<!-- Agama -->
							<div class="relative w-full">
								<select
									id="religion"
									bind:value={formData.religion}
									class="peer ease w-full appearance-none rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								>
									<option value="" disabled selected></option>
									<option value="islam">Islam</option>
									<option value="kristen">Kristen</option>
									<option value="katolik">Katolik</option>
									<option value="hindu">Hindu</option>
									<option value="buddha">Buddha</option>
									<option value="konghucu">Konghucu</option>
								</select>
								<label
									for="religion"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Agama</label
								>
								<div
									class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/></svg
									>
								</div>
							</div>

							<!-- Transportasi -->
							<div class="relative w-full">
								<select
									id="transportation"
									bind:value={formData.transportation}
									class="peer ease w-full appearance-none rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								>
									<option value="" disabled selected></option>
									<option value="jalan_kaki">Jalan Kaki</option>
									<option value="kendaraan_pribadi">Kendaraan Pribadi</option>
									<option value="angkutan_umum">Angkutan Umum</option>
									<option value="antar_jemput">Antar Jemput</option>
									<option value="lainnya">Lainnya</option>
								</select>
								<label
									for="transportation"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Transportasi</label
								>
								<div
									class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/></svg
									>
								</div>
							</div>

							<!-- BPJS -->
							<div class="relative w-full">
								<input
									type="text"
									id="bpjs"
									bind:value={formData.bpjs}
									placeholder=" "
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="bpjs"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>No. BPJS (Opsional)</label
								>
							</div>
						</div>
					</div>
				</div>

				<!-- Tab Content: Parent Data -->
			{:else if activeTab === 'parents'}
				<div class="animate-fade-in">
					<ParentBiodata bind:fatherData={formData.father} bind:motherData={formData.mother} />
				</div>

				<!-- Tab Content: Guardian Data -->
			{:else if activeTab === 'guardian'}
				<div class="animate-fade-in">
					<div class="rounded-xl border border-slate-100 bg-white p-6 py-12 text-center shadow-sm">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-slate-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-medium text-slate-800">Data Wali (Opsional)</h3>
						<p class="mx-auto mt-2 max-w-md text-slate-500">
							Fitur ini opsional. Jika siswa tinggal bersama orang tua kandung, bagian ini tidak
							perlu diisi.
						</p>
						<button
							type="button"
							class="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
						>
							+ Tambah Data Wali
						</button>
					</div>
				</div>
			{/if}

			<!-- Action Buttons (Always Visible) -->
			<div class="mt-8 flex items-center justify-end gap-4 border-t border-slate-200 pt-4">
				<button
					type="button"
					class="rounded-lg px-6 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
				>
					Batal
				</button>
				<button
					type="submit"
					class="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
				>
					Simpan Data Siswa
				</button>
			</div>
		</form>
	</div>
</div>

<!--<style>-->
<!--	@keyframes fade-in {-->
<!--		from {-->
<!--			opacity: 0;-->
<!--			transform: translateY(5px);-->
<!--		}-->
<!--		to {-->
<!--			opacity: 1;-->
<!--			transform: translateY(0);-->
<!--		}-->
<!--	}-->
<!--	.animate-fade-in {-->
<!--		animation: fade-in 0.3s ease-out forwards;-->
<!--	}-->
<!--</style>-->
