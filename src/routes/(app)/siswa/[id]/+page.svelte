<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';
	import MutasiModal from '$lib/components/modal/MutasiModal.svelte';
	import GraduateModal from '$lib/components/modal/GraduateModal.svelte';

	type Student = {
		id: number;
		name: string;
		nisn: string;
		class: string;
		gender: string;
		cityOfOrigin: string;
		status: 'ACTIVE' | 'MUTASI' | 'GRADUATE';
		profilePhoto: string | null;

		// Full Profile Data
		nisn: string;
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
		father: {
			name: string;
			phone: string;
			job: string;
		} | null;
		mother: {
			name: string;
			phone: string;
			job: string;
		} | null;
		guardian: {
			name: string;
			phone: string;
			job: string;
		} | null;
	};

	let student: Student | null = null;
	let loading = true;
	let error = '';

	// Alert State
	let alertModal = {
		show: false,
		type: 'warning' as 'success' | 'error' | 'warning' | 'info',
		message: '',
		isConfirm: false
	};

	// Mutasi Modal State
	let showMutasiModal = false;
	let isMutasiLoading = false;

	// Graduate Modal State
	let showGraduateModal = false;
	let isGraduateLoading = false;

	onMount(async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				goto('/login');
				return;
			}

			// Endpoint matches backend/routes/api/student.js mounting (/:id)
			const response = await API_FETCH(`/routes/api/studentDataSet/${$page.params.id}`);

			if (!response.ok) {
				if (response.status === 401) {
					goto('/login');
					return;
				}
				throw new Error('Student not found');
			}

			const data = await response.json();

			// Map API composite response to FE Student type
			student = {
				id: data.id,
				name: data.studentName,
				class: data.class || 'Belum Masuk Kelas', // Placeholder until joined with class data
				gender: data.gender,
				cityOfOrigin: data.originRegion || data.birthPlace || '-',
				status: data.status || 'ACTIVE', // Use actual status from DB
				profilePhoto: data.profilePhoto || null,
				nisn: data.nisn || '-',
				localNis: data.localNis || '-',
				birthDate: data.birthDate || '-',
				religion: data.religion || '-',

				// Optional chaining for nested objects in case they are null
				address: data.address
					? {
							street: data.address.street,
							village: data.address.village,
							subDistrict: data.address.subDistrict,
							regency: data.address.regency, // or district depending on schema
							province: data.address.province
						}
					: null,
				father: data.father
					? {
							name: data.father.name,
							phone: data.father.phoneNumber,
							job: data.father.occupation
						}
					: null,
				mother: data.mother
					? {
							name: data.mother.name,
							phone: data.mother.phoneNumber,
							job: data.mother.occupation
						}
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

	function getStatusStyle(status: string): string {
		switch (status) {
			case 'ACTIVE':
			case 'active':
			case 'aktif':
				return 'border-green-400 bg-green-300 text-emerald-700';
			case 'MUTASI':
				return 'border-yellow-400 bg-yellow-300 text-yellow-700';
			case 'GRADUATE':
				return 'border-blue-400 bg-blue-300 text-blue-700';
			case 'warning':
				return 'border-amber-400 bg-amber-300 text-amber-700';
			case 'inactive':
			case 'nonaktif':
				return 'border-red-400 bg-red-300 text-red-700';
			default:
				return 'border-slate-400 bg-slate-300 text-slate-700';
		}
	}

	function getStatusLabel(status: string): string {
		switch (status) {
			case 'ACTIVE':
				return 'Aktif';
			case 'MUTASI':
				return 'Mutasi';
			case 'GRADUATE':
				return 'Lulus';
			default:
				return status;
		}
	}

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
		alertModal.show = false; // Close modal first
		loading = true;

		try {
			const response = await API_FETCH(`/routes/api/students/${$page.params.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Gagal menghapus siswa');
			}

			// Show success message briefly then redirect
			// Since we are redirecting, maybe just go straight to list
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
				body: JSON.stringify({
					status: 'MUTASI',
					...event.detail
				})
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

			// Refresh data - reassign to trigger Svelte reactivity
			if (student) {
				student = { ...student, status: 'MUTASI' };
			}
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

			// Refresh data - reassign to trigger Svelte reactivity
			if (student) {
				student = { ...student, status: 'GRADUATE' };
			}
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
		if (alertModal.isConfirm) {
			handleDelete();
		} else {
			alertModal.show = false;
		}
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

<div class="min-h-screen bg-slate-50 p-4 md:p-8">
	<div class="mx-auto max-w-4xl">
		<!-- Back button (Always visible) -->
		<a
			href="/siswa"
			class="mb-6 flex w-fit items-center gap-2 rounded-md bg-blue-100 p-2 text-blue-600 transition-colors hover:text-blue-800"
		>
			<span>
				<svg
					class="fill-blue-600"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					height="24"
					width="24"
				>
					<path
						fill-rule="evenodd"
						d="M12 2.25c-5.385 0 -9.75 4.365 -9.75 9.75s4.365 9.75 9.75 9.75 9.75 -4.365 9.75 -9.75S17.385 2.25 12 2.25Zm-4.28 9.22a0.75 0.75 0 0 0 0 1.06l3 3a0.75 0.75 0 1 0 1.06 -1.06l-1.72 -1.72h5.69a0.75 0.75 0 0 0 0 -1.5h-5.69l1.72 -1.72a0.75 0.75 0 0 0 -1.06 -1.06l-3 3Z"
						clip-rule="evenodd"
					></path>
				</svg>
			</span>
			<span> Kembali ke daftar </span>
		</a>

		{#if loading}
			<div class="flex h-64 items-center justify-center rounded-lg bg-white shadow-lg">
				<span class="loading loading-spinner loading-lg text-blue-500"></span>
			</div>
		{:else if error}
			<div
				class="flex h-64 flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg"
			>
				<h1 class="text-2xl font-bold text-red-500">Error</h1>
				<p class="mt-2 text-slate-600">{error}</p>
			</div>
		{:else if student}
			<!-- Student card parent -->
			<div class="space-y-4">
				<!-- Header Card -->
				<div class="border border-slate-400 bg-white p-6 md:rounded-md">
					<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
						<div class="flex items-center gap-3">
							<!-- student image -->
							<div
								class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border-2 border-slate-500 bg-slate-100"
							>
								{#if student.profilePhoto}
									<img
										src="{import.meta.env.VITE_API_URL}{student.profilePhoto}"
										alt="Foto {student.name}"
										class="h-full w-full object-cover"
									/>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-12 w-12 text-slate-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</div>

							<!-- student name and id -->
							<div>
								<div class="flex items-center gap-3">
									<h1 class="text-2xl font-bold tracking-tight text-slate-800">{student.name}</h1>
									<span
										class={`rounded-md px-3 py-0.5 text-xs font-bold tracking-wide uppercase ${getStatusStyle(student.status)}`}
									>
										{getStatusLabel(student.status)}
									</span>
								</div>
								<div class="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
									<p class="flex items-center gap-1.5">
										<span class="font-medium text-slate-700">NISN:</span>
										{student.nisn}
									</p>
									<p class="flex items-center gap-1.5">
										<span class="font-medium text-slate-700">NIS Lokal:</span>
										{student.localNis}
									</p>
									<p class="flex items-center gap-1.5">
										<span class="font-medium text-slate-700">Kelas:</span>
										{student.class}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div class="mt-6 flex flex-wrap gap-3">
						<a
							href="/siswa/{student.id}/edit"
							class="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-500 px-5 py-2 text-blue-50 capitalize transition-all duration-200 ease-in-out hover:bg-blue-700"
						>
							<span class="flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									enable-background="new 0 0 24 24"
									height="24px"
									viewBox="0 0 24 24"
									width="24px"
									fill="currentColor"
									><g><rect fill="none" height="24" width="24" /></g><g
										><g
											><g
												><path
													d="M3,17.46l0,3.04C3,20.78,3.22,21,3.5,21h3.04c0.13,0,0.26-0.05,0.35-0.15L17.81,9.94l-3.75-3.75L3.15,17.1 C3.05,17.2,3,17.32,3,17.46z"
												/></g
											><g
												><path
													d="M20.71,5.63l-2.34-2.34c-0.39-0.39-1.02-0.39-1.41,0l-1.83,1.83l3.75,3.75l1.83-1.83C21.1,6.65,21.1,6.02,20.71,5.63z"
												/></g
											></g
										></g
									></svg
								>
							</span>
							edit siswa
						</a>

						{#if student.status === 'ACTIVE'}
							<button
								on:click={() => (showGraduateModal = true)}
								class="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2 text-green-50 transition-colors hover:bg-green-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
								</svg>
								Luluskan Siswa
							</button>

							<button
								on:click={() => (showMutasiModal = true)}
								class="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-yellow-50 transition-colors hover:bg-yellow-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
										clip-rule="evenodd"
									/>
								</svg>
								Mutasi Siswa
							</button>
						{/if}

						<button
							on:click={confirmDelete}
							class="flex w-fit cursor-pointer items-center justify-center rounded-md bg-red-500 px-4 py-2 text-red-100 transition-colors hover:bg-red-700"
						>
							Hapus Siswa
						</button>
					</div>
				</div>

				<!-- Content Grid -->
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<!-- 1. Personal Info -->
					<div class="rounded-md border border-slate-400 bg-white p-6">
						<h3 class="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
							<svg
								class="h-5 w-5 text-blue-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								></path></svg
							>
							Data Pribadi
						</h3>
						<div class="space-y-3 text-sm">
							<div>
								<p class="text-xs text-slate-500 uppercase">Jenis Kelamin</p>
								<p class="font-medium text-slate-700 capitalize">{student.gender || '-'}</p>
							</div>
							<div>
								<p class="text-xs text-slate-500 uppercase">Tempat, Tanggal Lahir</p>
								<p class="font-medium text-slate-700">
									{student.cityOfOrigin}, {student.birthDate}
								</p>
							</div>
							<div>
								<p class="text-xs text-slate-500 uppercase">Agama</p>
								<p class="font-medium text-slate-700">{student.religion}</p>
							</div>
						</div>
					</div>

					<!-- 2. Address -->
					<div class="rounded-md border border-slate-400 bg-white p-6">
						<h3 class="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
							<svg
								class="h-5 w-5 text-orange-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								></path><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								></path></svg
							>
							Alamat Domisili
						</h3>
						{#if student.address}
							<div class="space-y-3 text-sm">
								<div>
									<p class="text-xs text-slate-500 uppercase">Jalan</p>
									<p class="font-medium text-slate-700">{student.address.street || '-'}</p>
								</div>
								<div>
									<p class="text-xs text-slate-500 uppercase">Desa / Kec</p>
									<p class="font-medium text-slate-700">
										{student.address.village} / {student.address.subDistrict}
									</p>
								</div>
								<div>
									<p class="text-xs text-slate-500 uppercase">Kab / Prov</p>
									<p class="font-medium text-slate-700">
										{student.address.regency}, {student.address.province}
									</p>
								</div>
							</div>
						{:else}
							<p class="text-sm text-slate-400 italic">Data alamat belum lengkap.</p>
						{/if}
					</div>

					<!-- 3. Family Info (Merged for compactness or separate) -->
					<div class="rounded-md border border-slate-400 bg-white p-6 md:col-span-2 lg:col-span-1">
						<h3 class="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
							<svg
								class="h-5 w-5 text-emerald-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								></path></svg
							>
							Data Orang Tua
						</h3>
						<div class="space-y-4 text-sm">
							<!-- Father -->
							<div class="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
								<p class="mb-1 text-xs font-bold text-slate-400 uppercase">Ayah</p>
								{#if student.father}
									<p class="font-medium text-slate-800">{student.father.name}</p>
									<p class="mt-0.5 text-xs text-slate-500">
										{student.father.job} • {student.father.phone}
									</p>
								{:else}
									<p class="text-slate-400 italic">-</p>
								{/if}
							</div>
							<!-- Mother -->
							<div class="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
								<p class="mb-1 text-xs font-bold text-slate-400 uppercase">Ibu</p>
								{#if student.mother}
									<p class="font-medium text-slate-800">{student.mother.name}</p>
									<p class="mt-0.5 text-xs text-slate-500">
										{student.mother.job} • {student.mother.phone}
									</p>
								{:else}
									<p class="text-slate-400 italic">-</p>
								{/if}
							</div>
							<!-- Guardian -->
							{#if student.guardian}
								<div>
									<p class="mb-1 text-xs font-bold text-slate-400 uppercase">Wali</p>
									<p class="font-medium text-slate-800">{student.guardian.name}</p>
									<p class="mt-0.5 text-xs text-slate-500">
										{student.guardian.job} • {student.guardian.phone}
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
