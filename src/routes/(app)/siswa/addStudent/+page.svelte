<script lang="ts">
	import PhoneInput from '$lib/components/input/PhoneInput.svelte';
	import ParentBiodata from '$lib/components/layout/parentBiodata.svelte';
	import Arrow_Left from '$lib/components/icons/arrow_left.svelte';

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

		// Contact
		phoneNumber: '',

		// Address (Structured)
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
		<!--		back button    -->

		<a
			href="/siswa"
			class="my-4 flex w-fit cursor-pointer items-center justify-center gap-3 rounded-full bg-blue-300 px-5 py-1.5 text-xs text-blue-800 capitalize md:text-lg"
		>
			<Arrow_Left /> kembali
		</a>

		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-slate-800">Tambah Siswa Baru</h1>
			<p class="mt-2 text-sm text-slate-600">
				Lengkapi data siswa di bawah ini sesuai dengan dokumen resmi (KK/Akta).
			</p>
		</div>

		<!-- Tabs -->
		<div class="mb-8 border-b border-slate-200">
			<nav class="-mb-px flex space-x-2" aria-label="Tabs">
				<button
					on:click={() => (activeTab = 'student')}
					class="border-b-2 px-1 py-4 text-xs font-medium whitespace-nowrap transition-colors md:text-sm {activeTab ===
					'student'
						? 'border-blue-500 text-blue-600 font-semibold'
						: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
				>
					Data Siswa
				</button>
				<button
					on:click={() => (activeTab = 'parents')}
					class="border-b-2 px-1 py-4 text-xs font-medium whitespace-nowrap transition-colors md:text-sm {activeTab ===
					'parents'
						? 'border-blue-500 text-blue-600 font-semibold'
						: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
				>
					Data Orang Tua
				</button>
				<button
					on:click={() => (activeTab = 'guardian')}
					class="border-b-2 px-1 py-4 text-xs font-medium whitespace-nowrap transition-colors md:text-sm {activeTab ===
					'guardian'
						? 'border-blue-500 text-blue-600 font-semibold'
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
					<div class="rounded-xl border border-slate-100 bg-white p-6">
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
					<div class="rounded-xl border border-slate-100 bg-white p-6">
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
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="studentName"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
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
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="nisn"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
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
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="localNis"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
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
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="idCardNumber"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
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
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="birthCertificateNumber"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
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
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="birthPlace"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
									>Tempat Lahir</label
								>
							</div>

							<!-- Tanggal Lahir -->
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
									class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
								/>
								<label
									for="nationality"
									class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
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

					<!-- Section 2: Kontak & Alamat -->
					<div class="rounded-xl border border-slate-100 bg-white p-6">
						<h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600"
								>2</span
							>
							Kontak & Alamat
						</h2>

						<div class="grid gap-6 md:grid-cols-2">
							<!-- Phone Number -->
							<div class="md:col-span-2">
								<PhoneInput bind:value={formData.phoneNumber} label="Nomor Telepon / WA Siswa" />
							</div>

							<!-- Address Fields -->
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
				</div>

				<!-- Tab Content: Parent Data -->
			{:else if activeTab === 'parents'}
				<div class="animate-fade-in">
					<ParentBiodata bind:fatherData={formData.father} bind:motherData={formData.mother} />
				</div>

				<!-- Tab Content: Guardian Data -->
			{:else if activeTab === 'guardian'}
				<div class="animate-fade-in">
					<div class="rounded-xl border border-slate-400 bg-white p-6 py-12 text-center">
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
			<div class="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
				<button
					type="button"
					class="rounded-lg bg-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-300"
				>
					Batal
				</button>
				<button
					type="submit"
					class="rounded-md bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700"
				>
					Simpan Data Siswa
				</button>
			</div>
		</form>
	</div>
</div>
