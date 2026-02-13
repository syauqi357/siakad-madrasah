<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';
	import MutasiModal from '$lib/components/modal/MutasiModal.svelte';
	import GraduateModal from '$lib/components/modal/GraduateModal.svelte';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';
	import MutationIcon from '$lib/components/icons/mutationIcon.svelte';
	import EditIcon from '$lib/components/icons/editIcon.svelte';
	import DeleteIcon from '$lib/components/icons/deleteIcon.svelte';
	import GraduateIcon from '$lib/components/icons/graduateIcon.svelte';

	type Parent = {
		nik: string;
		name: string;
		birthPlace: string;
		birthDate: string;
		birthYear: string;
		education: string;
		occupation: string;
		monthlyIncome: string;
		phoneNumber: string;
		isAlive: number;
	};

	type Student = {
		id: number;
		studentName: string;
		nisn: string;
		localNis: string;
		gender: string;
		religion: string;
		birthPlace: string;
		birthDate: string;
		previousSchool: string;
		phoneNumber: string;
		childOrder: string;
		siblingsCount: string;
		originRegion: string;
		bpjs: string;
		idCardNumber: string;
		birthCertificateNumber: string;
		nationality: string;
		livingWith: string;
		transportation: string;
		profilePhoto: string | null;
		status: 'ACTIVE' | 'MUTASI' | 'GRADUATE';
		class: string;
		address: {
			province: string;
			regency: string;
			district: string;
			subDistrict: string;
			village: string;
			hamlet: string;
			street: string;
			houseNumber: string;
			rt: string;
			rw: string;
			postalCode: string;
		} | null;
		father: Parent | null;
		mother: Parent | null;
		guardian: Parent | null;
	};

	let student: Student | null = null;
	let loading = true;
	let error = '';

	let alertModal = {
		show: false,
		type: 'warning' as 'success' | 'error' | 'warning' | 'info',
		message: '',
		isConfirm: false
	};

	let showMutasiModal = false;
	let isMutasiLoading = false;
	let showGraduateModal = false;
	let isGraduateLoading = false;

	const d = (val: unknown): string => {
		if (val == null || val === '') return '-';
		if (typeof val === 'bigint') return val.toString();
		if (typeof val === 'number') {
			if (!Number.isFinite(val)) return '-';
			// Prevent scientific notation for large integers (NIK, NISN, akta, BPJS, etc.)
			if (Number.isInteger(val)) return val.toFixed(0);
			return String(val);
		}
		return String(val);
	};

	onMount(async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				goto('/login');
				return;
			}

			const response = await API_FETCH(`/routes/api/studentDataSet/${$page.params.id}`);

			if (!response.ok) {
				if (response.status === 401) {
					goto('/login');
					return;
				}
				throw new Error('Student not found');
			}

			const data = await response.json();

			student = {
				id: data.id,
				studentName: d(data.studentName),
				nisn: d(data.nisn),
				localNis: d(data.localNis),
				gender: d(data.gender),
				religion: d(data.religion),
				birthPlace: d(data.birthPlace),
				birthDate: d(data.birthDate),
				previousSchool: d(data.previousSchool),
				phoneNumber: d(data.phoneNumber),
				childOrder: d(data.childOrder),
				siblingsCount: d(data.siblingsCount),
				originRegion: d(data.originRegion),
				bpjs: d(data.bpjs),
				idCardNumber: d(data.idCardNumber),
				birthCertificateNumber: d(data.birthCertificateNumber),
				nationality: d(data.nationality),
				livingWith: d(data.livingWith),
				transportation: d(data.transportation),
				profilePhoto: data.profilePhoto || null,
				status: data.status || 'ACTIVE',
				class: data.class || 'Belum Masuk Kelas',
				address: data.address
					? {
							province: d(data.address.province),
							regency: d(data.address.regency),
							district: d(data.address.district),
							subDistrict: d(data.address.subDistrict),
							village: d(data.address.village),
							hamlet: d(data.address.hamlet),
							street: d(data.address.street),
							houseNumber: d(data.address.houseNumber),
							rt: d(data.address.rt),
							rw: d(data.address.rw),
							postalCode: d(data.address.postalCode)
						}
					: null,
				father: data.father
					? {
							nik: d(data.father.nik),
							name: d(data.father.name),
							birthPlace: d(data.father.birthPlace),
							birthDate: d(data.father.birthDate),
							birthYear: d(data.father.birthYear),
							education: d(data.father.education),
							occupation: d(data.father.occupation),
							monthlyIncome: d(data.father.monthlyIncome),
							phoneNumber: d(data.father.phoneNumber),
							isAlive: data.father.isAlive ?? 1
						}
					: null,
				mother: data.mother
					? {
							nik: d(data.mother.nik),
							name: d(data.mother.name),
							birthPlace: d(data.mother.birthPlace),
							birthDate: d(data.mother.birthDate),
							birthYear: d(data.mother.birthYear),
							education: d(data.mother.education),
							occupation: d(data.mother.occupation),
							monthlyIncome: d(data.mother.monthlyIncome),
							phoneNumber: d(data.mother.phoneNumber),
							isAlive: data.mother.isAlive ?? 1
						}
					: null,
				guardian: data.guardian
					? {
							nik: d(data.guardian.nik),
							name: d(data.guardian.name),
							birthPlace: d(data.guardian.birthPlace),
							birthDate: d(data.guardian.birthDate),
							birthYear: d(data.guardian.birthYear),
							education: d(data.guardian.education),
							occupation: d(data.guardian.occupation),
							monthlyIncome: d(data.guardian.monthlyIncome),
							phoneNumber: d(data.guardian.phoneNumber),
							isAlive: data.guardian.isAlive ?? 1
						}
					: null
			};
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
		}
	});

	const statusConfig = {
		ACTIVE: { label: 'Aktif', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
		MUTASI: { label: 'Mutasi', class: 'bg-amber-50 text-amber-700 border-amber-200' },
		GRADUATE: { label: 'Lulus', class: 'bg-sky-50 text-sky-700 border-sky-200' }
	};

	function confirmDelete() {
		alertModal = {
			show: true,
			type: 'warning',
			message:
				'Apakah anda yakin ingin menghapus data siswa ini? Data yang dihapus tidak dapat dikembalikan.',
			isConfirm: true
		};
	}

	async function handleDelete() {
		alertModal.show = false;
		loading = true;

		try {
			const response = await API_FETCH(`/routes/api/students/${$page.params.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) throw new Error('Gagal menghapus siswa');
			goto('/siswa');
		} catch (err) {
			loading = false;
			alertModal = {
				show: true,
				type: 'error',
				message: err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus data',
				isConfirm: false
			};
		}
	}

	async function handleMutasiSubmit(
		event: CustomEvent<{
			mutasiType: string;
			reason: string;
			destinationSchool: string | null;
			completionDate: string;
		}>
	) {
		isMutasiLoading = true;

		try {
			const response = await API_FETCH(`/routes/api/students/${$page.params.id}/status`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'MUTASI', ...event.detail })
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.message || 'Gagal memproses mutasi');
			}

			showMutasiModal = false;
			alertModal = {
				show: true,
				type: 'success',
				message: 'Siswa berhasil dimutasi',
				isConfirm: false
			};

			if (student) student = { ...student, status: 'MUTASI' };
		} catch (err) {
			alertModal = {
				show: true,
				type: 'error',
				message: err instanceof Error ? err.message : 'Terjadi kesalahan',
				isConfirm: false
			};
		} finally {
			isMutasiLoading = false;
		}
	}

	async function handleGraduateSubmit(
		event: CustomEvent<{
			graduationYear: string;
			completionDate: string;
			certificateNumber: string | null;
			finalGrade: string | null;
		}>
	) {
		isGraduateLoading = true;

		try {
			const response = await API_FETCH(`/routes/api/graduates/${$page.params.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(event.detail)
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.message || 'Gagal memproses kelulusan');
			}

			showGraduateModal = false;
			alertModal = {
				show: true,
				type: 'success',
				message: 'Siswa berhasil diluluskan',
				isConfirm: false
			};

			if (student) student = { ...student, status: 'GRADUATE' };
		} catch (err) {
			alertModal = {
				show: true,
				type: 'error',
				message: err instanceof Error ? err.message : 'Terjadi kesalahan',
				isConfirm: false
			};
		} finally {
			isGraduateLoading = false;
		}
	}
</script>

<ModalAlert
	show={alertModal.show}
	type={alertModal.type}
	message={alertModal.message}
	showCancel={alertModal.isConfirm}
	on:close={() => (alertModal.show = false)}
	on:confirm={() => {
		if (alertModal.isConfirm) handleDelete();
		else alertModal.show = false;
	}}
/>

{#if student}
	<MutasiModal
		show={showMutasiModal}
		studentName={student.studentName}
		studentNisn={student.nisn}
		isLoading={isMutasiLoading}
		on:close={() => (showMutasiModal = false)}
		on:submit={handleMutasiSubmit}
	/>

	<GraduateModal
		show={showGraduateModal}
		studentName={student.studentName}
		studentNisn={student.nisn}
		isLoading={isGraduateLoading}
		on:close={() => (showGraduateModal = false)}
		on:submit={handleGraduateSubmit}
	/>
{/if}

<div class="min-h-screen bg-slate-50">
	<div class="mx-auto max-w-6xl">
		{#if loading}
			<div class="flex h-screen items-center justify-center">
				<div class="text-center">
					<div
						class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
					></div>
					<p class="mt-4 text-slate-500">Memuat data...</p>
				</div>
			</div>
		{:else if error}
			<div class="flex h-screen flex-col items-center justify-center px-4">
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
					<span class="h-6 w-6 border border-dashed border-red-300"></span>
				</div>
				<h2 class="text-xl font-semibold text-slate-800">Terjadi Kesalahan</h2>
				<p class="mt-2 text-slate-500">{error}</p>
				<a href="/siswa" class="mt-6 text-blue-600 hover:underline">Kembali ke daftar</a>
			</div>
		{:else if student}
			<!-- Top Bar -->
			<header>
				<div class="flex items-center justify-between px-6 py-3">
					<a
						href="/siswa"
						class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
					>
						<ArrowLeft />
						<span class="font-medium">Kembali</span>
					</a>

					<div class="flex items-center gap-2">
						{#if student.status === 'ACTIVE'}
							<button
								on:click={() => (showGraduateModal = true)}
								class="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
							>
								<GraduateIcon />
								Luluskan
							</button>
							<button
								on:click={() => (showMutasiModal = true)}
								class="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
							>
								<MutationIcon />
								Mutasi
							</button>
						{/if}
						<a
							href="/siswa/{student.id}/edit"
							class="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
						>
							<EditIcon />
							Edit
						</a>
						<button
							on:click={confirmDelete}
							class="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
						>
							<DeleteIcon />
							Hapus
						</button>
					</div>
				</div>
			</header>

			<div class="space-y-4 p-6">
				<div class="rounded-md border border-slate-200 bg-white p-6">
					<div class="flex gap-6">
						<div
							class="h-36 w-36 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100"
						>
							{#if student.profilePhoto}
								<img
									src="{import.meta.env.VITE_API_URL}{student.profilePhoto}"
									alt="Foto {student.studentName}"
									class="h-full w-full object-cover"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-slate-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-16 w-16"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="1"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
							{/if}
						</div>

						<div class="flex flex-1 flex-col justify-center">
							<div class="flex items-center gap-3">
								<h1 class="text-2xl font-bold text-slate-900">{student.studentName}</h1>
								<span
									class="rounded-sm border px-2.5 py-0.5 text-xs font-semibold {statusConfig[
										student.status
									]?.class || 'border-slate-200 bg-slate-50 text-slate-600'}"
								>
									{statusConfig[student.status]?.label || student.status}
								</span>
							</div>
							<p class="mt-1 text-slate-500">{student.class}</p>

							<div class="mt-5 flex items-center gap-10 border-t border-slate-100 pt-5">
								<div>
									<p class="text-xs font-medium text-slate-400">NISN</p>
									<p class="mt-0.5 text-base font-semibold text-slate-900 tabular-nums">
										{student.nisn}
									</p>
								</div>
								<div class="h-8 w-px bg-slate-200"></div>
								<div>
									<p class="text-xs font-medium text-slate-400">NIS Lokal</p>
									<p class="mt-0.5 text-base font-semibold text-slate-900 tabular-nums">
										{student.localNis}
									</p>
								</div>
								<div class="h-8 w-px bg-slate-200"></div>
								<div>
									<p class="text-xs font-medium text-slate-400">Jenis Kelamin</p>
									<p class="mt-0.5 text-base font-semibold text-slate-900 capitalize">
										{student.gender}
									</p>
								</div>
								<div class="h-8 w-px bg-slate-200"></div>
								<div>
									<p class="text-xs font-medium text-slate-400">Agama</p>
									<p class="mt-0.5 text-base font-semibold text-slate-900">{student.religion}</p>
								</div>
								<div class="h-8 w-px bg-slate-200"></div>
								<div>
									<p class="text-xs font-medium text-slate-400">Kewarganegaraan</p>
									<p class="mt-0.5 text-base font-semibold text-slate-900">
										{student.nationality}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-4">
					<!-- Kelahiran -->
					<div class="rounded-md border border-slate-200 bg-white p-5">
						<h2 class="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
							Kelahiran
						</h2>
						<div class="space-y-3">
							<div>
								<p class="text-xs text-slate-500">Tempat Lahir</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">{student.birthPlace}</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Tanggal Lahir</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">{student.birthDate}</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Asal Daerah</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">{student.originRegion}</p>
							</div>
						</div>
					</div>

					<!-- Dokumen -->
					<div class="rounded-md border border-slate-200 bg-white p-5">
						<h2 class="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
							Nomor Dokumen
						</h2>
						<div class="space-y-3">
							<div>
								<p class="text-xs text-slate-500">No. KTP / NIK</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">
									{student.idCardNumber}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">No. Akta Kelahiran</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">
									{student.birthCertificateNumber}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">No. BPJS</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">
									{student.bpjs}
								</p>
							</div>
						</div>
					</div>

					<!-- Kondisi -->
					<div class="rounded-md border border-slate-200 bg-white p-5">
						<h2 class="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
							Kondisi Siswa
						</h2>
						<div class="space-y-3">
							<div>
								<p class="text-xs text-slate-500">No. Telepon</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">{student.phoneNumber}</p>
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<p class="text-xs text-slate-500">Anak Ke-</p>
									<p class="mt-0.5 text-sm font-semibold text-slate-900">
										{student.childOrder}
									</p>
								</div>
								<div>
									<p class="text-xs text-slate-500">Jumlah Saudara</p>
									<p class="mt-0.5 text-sm font-semibold text-slate-900">
										{student.siblingsCount}
									</p>
								</div>
							</div>
							<div>
								<p class="text-xs text-slate-500">Tinggal Bersama</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">{student.livingWith}</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Transportasi</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.transportation}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Sekolah Sebelumnya</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.previousSchool}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-md border border-slate-200 bg-white p-5">
					<h2 class="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
						Alamat Domisili
					</h2>
					{#if student.address}
						<div class="grid grid-cols-4 gap-x-6 gap-y-3">
							<div class="col-span-2">
								<p class="text-xs text-slate-500">Jalan</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.address.street}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">No. Rumah</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.address.houseNumber}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Dusun</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.address.hamlet}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">RT / RW</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.address.rt} / {student.address.rw}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Desa/Kelurahan</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.address.village}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Kecamatan</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.address.subDistrict}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Kabupaten/Kota</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.address.regency}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Provinsi</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900">
									{student.address.province}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500">Kode Pos</p>
								<p class="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">
									{student.address.postalCode}
								</p>
							</div>
						</div>
					{:else}
						<p class="text-sm text-slate-400 italic">Data alamat belum tersedia</p>
					{/if}
				</div>

				<div
					class="grid gap-4"
					class:grid-cols-2={!student.guardian}
					class:grid-cols-3={student.guardian}
				>
					<!-- Ayah -->
					<div class="rounded-md border border-slate-200 bg-white p-5">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-xs font-bold tracking-wider text-slate-400 uppercase">Data Ayah</h2>
							{#if student.father}
								<span
									class="rounded-sm border px-2 py-0.5 text-sm font-medium {student.father.isAlive
										? 'border-emerald-200 bg-emerald-50 text-emerald-700'
										: 'border-red-200 bg-red-50 text-red-500'}"
								>
									{student.father.isAlive ? 'Masih Hidup' : 'Almarhum'}
								</span>
							{/if}
						</div>
						{#if student.father}
							<div class="space-y-3">
								<div>
									<p class="text-xs text-slate-500">Nama Lengkap</p>
									<p class="mt-0.5 text-sm font-semibold text-slate-900">
										{student.father.name}
									</p>
								</div>
								<div>
									<p class="text-xs text-slate-500">NIK</p>
									<p class="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">
										{student.father.nik}
									</p>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-slate-500">Tempat Lahir</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.father.birthPlace}
										</p>
									</div>
									<div>
										<p class="text-xs text-slate-500">Tanggal Lahir</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.father.birthDate}
										</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-slate-500">Pendidikan</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.father.education}
										</p>
									</div>
									<div>
										<p class="text-xs text-slate-500">Pekerjaan</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.father.occupation}
										</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-slate-500">Penghasilan/Bulan</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.father.monthlyIncome}
										</p>
									</div>
									<div>
										<p class="text-xs text-slate-500">No. Telepon</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.father.phoneNumber}
										</p>
									</div>
								</div>
							</div>
						{:else}
							<p class="text-sm text-slate-400 italic">Data ayah belum tersedia</p>
						{/if}
					</div>

					<!-- Ibu -->
					<div class="rounded-md border border-slate-200 bg-white p-5">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-md font-bold tracking-wider text-slate-400 uppercase">Data Ibu</h2>
							{#if student.mother}
								<span
									class="rounded-sm border px-2 py-0.5 text-sm	 font-medium {student.mother.isAlive
										? 'border-emerald-200 bg-emerald-50 text-emerald-700'
										: 'border-red-200 bg-red-50 text-red-500'}"
								>
									{student.mother.isAlive ? 'Masih Hidup' : 'Almarhumah'}
								</span>
							{/if}
						</div>
						{#if student.mother}
							<div class="space-y-3">
								<div>
									<p class="text-xs text-slate-500">Nama Lengkap</p>
									<p class="mt-0.5 text-sm font-semibold text-slate-900">
										{student.mother.name}
									</p>
								</div>
								<div>
									<p class="text-xs text-slate-500">NIK</p>
									<p class="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">
										{student.mother.nik}
									</p>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-slate-500">Tempat Lahir</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.mother.birthPlace}
										</p>
									</div>
									<div>
										<p class="text-xs text-slate-500">Tanggal Lahir</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.mother.birthDate}
										</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-slate-500">Pendidikan</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.mother.education}
										</p>
									</div>
									<div>
										<p class="text-xs text-slate-500">Pekerjaan</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.mother.occupation}
										</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-slate-500">Penghasilan/Bulan</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.mother.monthlyIncome}
										</p>
									</div>
									<div>
										<p class="text-xs text-slate-500">No. Telepon</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.mother.phoneNumber}
										</p>
									</div>
								</div>
							</div>
						{:else}
							<p class="text-sm text-slate-400 italic">Data ibu belum tersedia</p>
						{/if}
					</div>

					<!-- Wali (only rendered if exists) -->
					{#if student.guardian}
						<div class="rounded-md border border-slate-200 bg-white p-5">
							<div class="mb-4 flex items-center justify-between">
								<h2 class="text-xs font-bold tracking-wider text-slate-400 uppercase">Data Wali</h2>
								<span
									class="rounded-sm border px-2 py-0.5 text-xs font-medium {student.guardian.isAlive
										? 'border-emerald-200 bg-emerald-50 text-emerald-700'
										: 'border-slate-200 bg-slate-50 text-slate-500'}"
								>
									{student.guardian.isAlive ? 'Masih Hidup' : 'Almarhum/ah'}
								</span>
							</div>
							<div class="space-y-3">
								<div>
									<p class="text-xs text-slate-500">Nama Lengkap</p>
									<p class="mt-0.5 text-sm font-semibold text-slate-900">
										{student.guardian.name}
									</p>
								</div>
								<div>
									<p class="text-xs text-slate-500">NIK</p>
									<p class="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">
										{student.guardian.nik}
									</p>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-slate-500">Tempat Lahir</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.guardian.birthPlace}
										</p>
									</div>
									<div>
										<p class="text-xs text-slate-500">Tanggal Lahir</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.guardian.birthDate}
										</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-slate-500">Pendidikan</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.guardian.education}
										</p>
									</div>
									<div>
										<p class="text-xs text-slate-500">Pekerjaan</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.guardian.occupation}
										</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-slate-500">Penghasilan/Bulan</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.guardian.monthlyIncome}
										</p>
									</div>
									<div>
										<p class="text-xs text-slate-500">No. Telepon</p>
										<p class="mt-0.5 text-sm font-semibold text-slate-900">
											{student.guardian.phoneNumber}
										</p>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
