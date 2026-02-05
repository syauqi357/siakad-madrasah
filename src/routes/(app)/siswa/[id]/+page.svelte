<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';
	import MutasiModal from '$lib/components/modal/MutasiModal.svelte';
	import GraduateModal from '$lib/components/modal/GraduateModal.svelte';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';

	type Student = {
		id: number;
		name: string;
		nisn: string;
		class: string;
		gender: string;
		cityOfOrigin: string;
		status: 'ACTIVE' | 'MUTASI' | 'GRADUATE';
		profilePhoto: string | null;
		localNis: string;
		birthDate: string;
		religion: string;
		address: {
			street: string;
			village: string;
			subDistrict: string;
			regency: string;
			province: string;
		} | null;
		father: { name: string; phone: string; job: string } | null;
		mother: { name: string; phone: string; job: string } | null;
		guardian: { name: string; phone: string; job: string } | null;
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
				name: data.studentName,
				class: data.class || 'Belum Masuk Kelas',
				gender: data.gender,
				cityOfOrigin: data.originRegion || data.birthPlace || '-',
				status: data.status || 'ACTIVE',
				profilePhoto: data.profilePhoto || null,
				nisn: data.nisn || '-',
				localNis: data.localNis || '-',
				birthDate: data.birthDate || '-',
				religion: data.religion || '-',
				address: data.address
					? {
							street: data.address.street,
							village: data.address.village,
							subDistrict: data.address.subDistrict,
							regency: data.address.regency,
							province: data.address.province
						}
					: null,
				father: data.father
					? { name: data.father.name, phone: data.father.phoneNumber, job: data.father.occupation }
					: null,
				mother: data.mother
					? { name: data.mother.name, phone: data.mother.phoneNumber, job: data.mother.occupation }
					: null,
				guardian: data.guardian
					? {
							name: data.guardian.name,
							phone: data.guardian.phoneNumber,
							job: data.guardian.occupation
						}
					: null
			} as Student;
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

	import MutationIcon from '$lib/components/icons/mutationIcon.svelte';
	import EditIcon from '$lib/components/icons/editIcon.svelte';
	import DeleteIcon from '$lib/components/icons/deleteIcon.svelte';
	import GraduateIcon from '$lib/components/icons/graduateIcon.svelte';
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
		studentName={student.name}
		studentNisn={student.nisn}
		isLoading={isMutasiLoading}
		on:close={() => (showMutasiModal = false)}
		on:submit={handleMutasiSubmit}
	/>

	<GraduateModal
		show={showGraduateModal}
		studentName={student.name}
		studentNisn={student.nisn}
		isLoading={isGraduateLoading}
		on:close={() => (showGraduateModal = false)}
		on:submit={handleGraduateSubmit}
	/>
{/if}

<div class="min-h-screen bg-white">
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
				<!-- svg: error icon (48x48) -->
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
					<span class="h-6 w-6 border border-dashed border-red-300"></span>
				</div>
				<h2 class="text-xl font-semibold text-slate-800">Terjadi Kesalahan</h2>
				<p class="mt-2 text-slate-500">{error}</p>
				<a href="/siswa" class="mt-6 text-blue-600 hover:underline">Kembali ke daftar</a>
			</div>
		{:else if student}
			<!-- Header Section -->
			<header class="border-b border-slate-200">
				<div class="flex items-center justify-between px-6 py-4">
					<a
						href="/siswa"
						class="flex items-center gap-3 px-4 py-2 transition-all ease-in-out hover:bg-blue-600 hover:text-blue-50"
					>
						<!-- svg: arrow-left (20x20) -->
						<span class="flex items-center justify-center">
							<ArrowLeft />
						</span>
						<span class="text-sm font-medium">Kembali</span>
					</a>

					<div class="flex items-center gap-2">
						{#if student.status === 'ACTIVE'}
							<button
								on:click={() => (showGraduateModal = true)}
								class="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
							>
								<!-- svg: graduation cap (18x18) -->
								<span class="h-5 w-5 flex justify-center items-center"><GraduateIcon/></span>
								Luluskan
							</button>
							<button
								on:click={() => (showMutasiModal = true)}
								class="flex items-center gap-2 border border-amber-400 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-300"
							>
								<!-- svg: transfer (18x18) -->
								<span class="h-5 w-5 flex justify-center items-center"><MutationIcon/></span>
								Mutasi
							</button>
						{/if}
						<a
							href="/siswa/{student.id}/edit"
							class="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							<!-- svg: edit (18x18) -->
							<span class="h-5 w-5 flex justify-center items-center"><EditIcon/></span>
							Edit
						</a>
						<button
							on:click={confirmDelete}
							class="flex items-center gap-2 border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
						>
							<!-- svg: trash (18x18) -->
							<span class="h-5 w-5 justify-center items-center flex"><DeleteIcon/></span>
							Hapus
						</button>
					</div>
				</div>
			</header>

			<!-- Profile Section -->
			<section class="border-b border-slate-200 px-6 py-8">
				<div class="flex gap-6">
					<!-- Photo -->
					<div class="h-32 w-32 flex-shrink-0 overflow-hidden border border-slate-200 bg-slate-50">
						{#if student.profilePhoto}
							<img
								src="{import.meta.env.VITE_API_URL}{student.profilePhoto}"
								alt="Foto {student.name}"
								class="h-full w-full object-cover"
							/>
						{:else}
							<!-- svg: user placeholder (64x64) -->
							<div class="flex h-full w-full items-center justify-center">
								<span class="h-16 w-16 border border-dashed border-slate-300"></span>
							</div>
						{/if}
					</div>

					<!-- Basic Info -->
					<div class="flex-1">
						<div class="flex items-start justify-between">
							<div>
								<div class="flex items-center gap-3">
									<h1 class="text-2xl font-semibold text-slate-900">{student.name}</h1>
									<span
										class="border px-2 py-1 text-xs font-medium {statusConfig[student.status]
											?.class || 'bg-slate-50 text-slate-600'}"
									>
										{statusConfig[student.status]?.label || student.status}
									</span>
								</div>
								<p class="mt-1 text-slate-500">{student.class}</p>
							</div>
						</div>

						<div class="mt-6 grid grid-cols-4 gap-8">
							<div>
								<p class="text-xs font-medium tracking-wider text-slate-400 uppercase">NISN</p>
								<p class="mt-1 text-lg font-medium text-slate-900">{student.nisn}</p>
							</div>
							<div>
								<p class="text-xs font-medium tracking-wider text-slate-400 uppercase">NIS Lokal</p>
								<p class="mt-1 text-lg font-medium text-slate-900">{student.localNis}</p>
							</div>
							<div>
								<p class="text-xs font-medium tracking-wider text-slate-400 uppercase">
									Jenis Kelamin
								</p>
								<p class="mt-1 text-lg font-medium text-slate-900 capitalize">
									{student.gender || '-'}
								</p>
							</div>
							<div>
								<p class="text-xs font-medium tracking-wider text-slate-400 uppercase">Agama</p>
								<p class="mt-1 text-lg font-medium text-slate-900">{student.religion}</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Details Grid -->
			<div class="grid grid-cols-2 divide-x divide-slate-200">
				<!-- Left Column -->
				<div class="divide-y divide-slate-200">
					<!-- Birth Info -->
					<section class="px-6 py-6">
						<div class="mb-4 flex items-center gap-3">
							<!-- svg: calendar (20x20) -->
							<span class="h-5 w-5 border border-dashed border-slate-300"></span>
							<h2 class="text-sm font-semibold tracking-wider text-slate-400 uppercase">
								Kelahiran
							</h2>
						</div>
						<div class="grid grid-cols-2 gap-6">
							<div>
								<p class="text-sm text-slate-500">Tempat Lahir</p>
								<p class="mt-1 text-base font-medium text-slate-900">{student.cityOfOrigin}</p>
							</div>
							<div>
								<p class="text-sm text-slate-500">Tanggal Lahir</p>
								<p class="mt-1 text-base font-medium text-slate-900">{student.birthDate}</p>
							</div>
						</div>
					</section>

					<!-- Address -->
					<section class="px-6 py-6">
						<div class="mb-4 flex items-center gap-3">
							<!-- svg: location (20x20) -->
							<span class="h-5 w-5 border border-dashed border-slate-300"></span>
							<h2 class="text-sm font-semibold tracking-wider text-slate-400 uppercase">
								Alamat Domisili
							</h2>
						</div>
						{#if student.address}
							<div class="space-y-4">
								<div>
									<p class="text-sm text-slate-500">Jalan</p>
									<p class="mt-1 text-base font-medium text-slate-900">
										{student.address.street || '-'}
									</p>
								</div>
								<div class="grid grid-cols-2 gap-6">
									<div>
										<p class="text-sm text-slate-500">Desa/Kelurahan</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.address.village || '-'}
										</p>
									</div>
									<div>
										<p class="text-sm text-slate-500">Kecamatan</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.address.subDistrict || '-'}
										</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-6">
									<div>
										<p class="text-sm text-slate-500">Kabupaten/Kota</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.address.regency || '-'}
										</p>
									</div>
									<div>
										<p class="text-sm text-slate-500">Provinsi</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.address.province || '-'}
										</p>
									</div>
								</div>
							</div>
						{:else}
							<p class="text-slate-400 italic">Data alamat belum tersedia</p>
						{/if}
					</section>
				</div>

				<!-- Right Column: Parents -->
				<div class="divide-y divide-slate-200">
					<!-- Father -->
					<section class="px-6 py-6">
						<div class="mb-4 flex items-center gap-3">
							<!-- svg: user male (20x20) -->
							<span class="h-5 w-5 border border-dashed border-slate-300"></span>
							<h2 class="text-sm font-semibold tracking-wider text-slate-400 uppercase">
								Data Ayah
							</h2>
						</div>
						{#if student.father}
							<div class="space-y-4">
								<div>
									<p class="text-sm text-slate-500">Nama Lengkap</p>
									<p class="mt-1 text-base font-medium text-slate-900">{student.father.name}</p>
								</div>
								<div class="grid grid-cols-2 gap-6">
									<div>
										<p class="text-sm text-slate-500">Pekerjaan</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.father.job || '-'}
										</p>
									</div>
									<div>
										<p class="text-sm text-slate-500">No. Telepon</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.father.phone || '-'}
										</p>
									</div>
								</div>
							</div>
						{:else}
							<p class="text-slate-400 italic">Data ayah belum tersedia</p>
						{/if}
					</section>

					<!-- Mother -->
					<section class="px-6 py-6">
						<div class="mb-4 flex items-center gap-3">
							<!-- svg: user female (20x20) -->
							<span class="h-5 w-5 border border-dashed border-slate-300"></span>
							<h2 class="text-sm font-semibold tracking-wider text-slate-400 uppercase">
								Data Ibu
							</h2>
						</div>
						{#if student.mother}
							<div class="space-y-4">
								<div>
									<p class="text-sm text-slate-500">Nama Lengkap</p>
									<p class="mt-1 text-base font-medium text-slate-900">{student.mother.name}</p>
								</div>
								<div class="grid grid-cols-2 gap-6">
									<div>
										<p class="text-sm text-slate-500">Pekerjaan</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.mother.job || '-'}
										</p>
									</div>
									<div>
										<p class="text-sm text-slate-500">No. Telepon</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.mother.phone || '-'}
										</p>
									</div>
								</div>
							</div>
						{:else}
							<p class="text-slate-400 italic">Data ibu belum tersedia</p>
						{/if}
					</section>

					<!-- Guardian -->
					{#if student.guardian}
						<section class="px-6 py-6">
							<div class="mb-4 flex items-center gap-3">
								<!-- svg: user shield (20x20) -->
								<span class="h-5 w-5 border border-dashed border-slate-300"></span>
								<h2 class="text-sm font-semibold tracking-wider text-slate-400 uppercase">
									Data Wali
								</h2>
							</div>
							<div class="space-y-4">
								<div>
									<p class="text-sm text-slate-500">Nama Lengkap</p>
									<p class="mt-1 text-base font-medium text-slate-900">{student.guardian.name}</p>
								</div>
								<div class="grid grid-cols-2 gap-6">
									<div>
										<p class="text-sm text-slate-500">Pekerjaan</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.guardian.job || '-'}
										</p>
									</div>
									<div>
										<p class="text-sm text-slate-500">No. Telepon</p>
										<p class="mt-1 text-base font-medium text-slate-900">
											{student.guardian.phone || '-'}
										</p>
									</div>
								</div>
							</div>
						</section>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
