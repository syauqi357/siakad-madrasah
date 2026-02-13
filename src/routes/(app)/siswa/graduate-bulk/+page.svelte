<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	// Alert state
	let alertModal = {
		show: false,
		type: 'success' as 'success' | 'error' | 'warning' | 'info',
		message: ''
	};

	function showAlert(type: 'success' | 'error' | 'warning' | 'info', message: string) {
		alertModal = { show: true, type, message };
	}

	// Types
	interface Student {
		id: number;
		nisn: string;
		name: string;
		gender: string;
		status: string;
	}

	interface Rombel {
		id: number;
		code: string;
		name: string;
		classId: number;
		className: string;
		activeStudentCount: number;
		isFinalGrade: boolean;
	}

	interface ClassGroup {
		classId: number;
		className: string;
		isFinalGrade: boolean;
		rombels: Rombel[];
	}

	interface AcademicYear {
		id: number;
		name: string;
		isActive: number;
	}

	// State
	let activeTab: 'select' | 'confirm' = 'select';
	let isLoading = true;
	let error: string | null = null;

	// Rombel & Students
	let classGroups: ClassGroup[] = [];
	let selectedRombel: Rombel | null = null;
	let students: Student[] = [];
	let selectedStudentIds: number[] = [];
	let loadingStudents = false;

	// Graduation data
	let academicYears: AcademicYear[] = [];
	let graduationYear = '';
	let completionDate = new Date().toISOString().split('T')[0];
	let isGraduating = false;
	let graduationResult: { success: any[]; failed: any[] } | null = null;

	// Fetch rombels (only final grade classes for graduation)
	async function fetchRombels() {
		isLoading = true;
		error = null;

		try {
			const response = await API_FETCH('/routes/api/promotion/rombels');
			if (!response.ok) throw new Error('Gagal mengambil data rombel');

			const result = await response.json();
			// Only show final grade classes (XII, IX, etc.)
			classGroups = (result.data || []).filter((g: ClassGroup) => g.isFinalGrade);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	// Fetch academic years
	async function fetchAcademicYears() {
		try {
			const response = await API_FETCH('/routes/api/academic-years/lite');
			if (response.ok) {
				const result = await response.json();
				academicYears = result.data || [];
				// Set default to active year
				const activeYear = academicYears.find((y) => y.isActive === 1);
				if (activeYear) {
					graduationYear = activeYear.name;
				}
			}
		} catch (err) {
			console.error('Error fetching academic years:', err);
		}
	}

	// Fetch students from selected rombel
	async function fetchStudents(rombelId: number) {
		loadingStudents = true;
		students = [];
		selectedStudentIds = [];

		try {
			const response = await API_FETCH(`/routes/api/promotion/students/${rombelId}`);
			if (!response.ok) throw new Error('Gagal mengambil data siswa');

			const result = await response.json();
			students = result.data || [];
		} catch (err) {
			console.error('Error fetching students:', err);
		} finally {
			loadingStudents = false;
		}
	}

	// Select rombel
	function selectRombel(rombel: Rombel) {
		selectedRombel = rombel;
		graduationResult = null;
		fetchStudents(rombel.id);
	}

	// Toggle student selection
	function toggleStudent(studentId: number) {
		if (selectedStudentIds.includes(studentId)) {
			selectedStudentIds = selectedStudentIds.filter((id) => id !== studentId);
		} else {
			selectedStudentIds = [...selectedStudentIds, studentId];
		}
	}

	// Select all students
	function selectAllStudents() {
		if (selectedStudentIds.length === students.length) {
			selectedStudentIds = [];
		} else {
			selectedStudentIds = students.map((s) => s.id);
		}
	}

	// Proceed to confirmation
	function proceedToConfirm() {
		if (selectedStudentIds.length === 0) {
			showAlert('warning', 'Pilih minimal satu siswa');
			return;
		}
		activeTab = 'confirm';
	}

	// Execute bulk graduation
	async function executeBulkGraduation() {
		if (!graduationYear) {
			showAlert('warning', 'Pilih tahun kelulusan');
			return;
		}
		if (!completionDate) {
			showAlert('warning', 'Pilih tanggal kelulusan');
			return;
		}

		const confirmMsg = `Luluskan ${selectedStudentIds.length} siswa?\n\nTahun: ${graduationYear}\nTanggal: ${completionDate}`;
		if (!confirm(confirmMsg)) return;

		isGraduating = true;
		graduationResult = null;

		try {
			const response = await API_FETCH('/routes/api/graduates/bulk', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					students: selectedStudentIds.map((id) => ({ studentId: id })),
					commonData: {
						completionDate,
						graduationYear
					}
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal meluluskan siswa');
			}

			graduationResult = {
				success: result.data?.success || [],
				failed: result.data?.failed || []
			};

			const successCount = result.data?.successCount || graduationResult.success.length;
			const failedCount = result.data?.failedCount || graduationResult.failed.length;

			// Refresh data
			await fetchRombels();
			if (selectedRombel) {
				await fetchStudents(selectedRombel.id);
			}
			selectedStudentIds = [];

			if (failedCount > 0) {
				showAlert('warning', `${successCount} siswa berhasil diluluskan, ${failedCount} gagal`);
			} else {
				showAlert('success', `Berhasil meluluskan ${successCount} siswa`);
			}
		} catch (err) {
			showAlert('error', err instanceof Error ? err.message : 'Terjadi kesalahan');
		} finally {
			isGraduating = false;
		}
	}

	// Get selected students data
	$: selectedStudents = students.filter((s) => selectedStudentIds.includes(s.id));

	onMount(() => {
		fetchRombels();
		fetchAcademicYears();
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
	<div class="mx-auto max-w-7xl px-4 py-8 md:px-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/siswa')}
			class="group mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50"
		>
			<span class="transition-transform group-hover:-translate-x-1"><ArrowLeft /></span>
			Kembali
		</button>

		<!-- Header -->
		<div class="mb-8">
			<div class="mb-2 flex items-center gap-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600"
				>
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
						/>
					</svg>
				</div>
				<div>
					<h1 class="text-2xl font-bold text-slate-800 md:text-3xl">Kelulusan Siswa</h1>
					<p class="text-sm text-slate-500">Luluskan beberapa siswa sekaligus dari kelas akhir</p>
				</div>
			</div>
		</div>

		<!-- Tabs -->
		<div class="mb-6 flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
			<button
				on:click={() => (activeTab = 'select')}
				class="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all {activeTab ===
				'select'
					? 'bg-emerald-500 text-white'
					: 'text-slate-600 hover:bg-slate-100'}"
			>
				<span
					class="flex h-5 w-5 items-center justify-center rounded-md text-xs {activeTab === 'select'
						? 'bg-white/20'
						: 'bg-slate-200'}">1</span
				>
				Pilih Siswa
			</button>
			<button
				on:click={() => selectedStudentIds.length > 0 && (activeTab = 'confirm')}
				disabled={selectedStudentIds.length === 0}
				class="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all disabled:opacity-40 {activeTab ===
				'confirm'
					? 'bg-emerald-500 text-white'
					: 'text-slate-600 hover:bg-slate-100'}"
			>
				<span
					class="flex h-5 w-5 items-center justify-center rounded-md text-xs {activeTab ===
					'confirm'
						? 'bg-white/20'
						: 'bg-slate-200'}">2</span
				>
				Konfirmasi
				{#if selectedStudentIds.length > 0}
					<span class="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700"
						>{selectedStudentIds.length}</span
					>
				{/if}
			</button>
		</div>

		<!-- Content -->
		{#if isLoading}
			<div class="flex flex-col items-center justify-center py-24">
				<div class="relative h-12 w-12">
					<div
						class="absolute inset-0 animate-spin rounded-md border-4 border-slate-200 border-t-emerald-500"
					></div>
				</div>
				<span class="mt-4 text-sm font-medium text-slate-500">Memuat data...</span>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center py-24 text-center">
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-red-100">
					<svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<p class="mb-2 text-lg font-semibold text-slate-800">Terjadi Kesalahan</p>
				<p class="mb-6 text-sm text-slate-500">{error}</p>
				<button
					on:click={fetchRombels}
					class="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600"
				>
					Coba Lagi
				</button>
			</div>
		{:else if activeTab === 'select'}
			<!-- Tab 1: Select Students -->
			<div class="grid gap-6 lg:grid-cols-3">
				<!-- Left: Rombel Selection -->
				<div class="overflow-hidden rounded-md border border-slate-200 bg-white">
					<div
						class="border-b border-slate-100 bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4"
					>
						<h3 class="font-semibold text-white">Pilih Kelas</h3>
						<p class="text-sm text-emerald-100">Hanya kelas akhir yang ditampilkan</p>
					</div>
					<div class="max-h-[28rem] overflow-y-auto p-4">
						{#if classGroups.length === 0}
							<div class="flex flex-col items-center py-12 text-center">
								<div
									class="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-slate-100"
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
								<p class="text-sm font-medium text-slate-600">Tidak ada kelas akhir</p>
								<p class="mt-1 text-xs text-slate-400">Pastikan ada kelas dengan tingkat akhir</p>
							</div>
						{:else}
							{#each classGroups as group}
								<div class="mb-5 last:mb-0">
									<p
										class="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-400 uppercase"
									>
										<span class="h-px flex-1 bg-slate-200"></span>
										Kelas {group.className}
										<span class="h-px flex-1 bg-slate-200"></span>
									</p>
									<div class="space-y-2">
										{#each group.rombels as rom}
											<button
												on:click={() => selectRombel(rom)}
												class="group flex w-full items-center justify-between rounded-xl border-2 p-3.5 text-left transition-all {selectedRombel?.id ===
												rom.id
													? 'border-emerald-500 bg-emerald-50'
													: 'border-transparent bg-slate-50 hover:border-slate-200 hover:bg-slate-100'}"
											>
												<div>
													<span class="font-semibold text-slate-800">{rom.name}</span>
													<span class="text-xs text-slate-500">{rom.code}</span>
												</div>
												<span
													class="flex h-8 w-8 items-center justify-center rounded-lg {selectedRombel?.id ===
													rom.id
														? 'bg-emerald-500 text-white'
														: 'bg-slate-200 text-slate-600'} text-sm font-bold"
												>
													{rom.activeStudentCount}
												</span>
											</button>
										{/each}
									</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>

				<!-- Right: Student List -->
				<div class="overflow-hidden rounded-md border border-slate-200 bg-white lg:col-span-2">
					<div
						class="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4"
					>
						<div>
							<h3 class="font-semibold text-slate-800">
								{selectedRombel ? `Siswa ${selectedRombel.name}` : 'Pilih kelas terlebih dahulu'}
							</h3>
							<p class="text-sm text-slate-500">
								<span class="font-semibold text-emerald-600">{selectedStudentIds.length}</span> dari {students.length}
								siswa dipilih
							</p>
						</div>
						{#if students.length > 0}
							<button
								on:click={selectAllStudents}
								class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100"
							>
								{selectedStudentIds.length === students.length ? 'Batal Semua' : 'Pilih Semua'}
							</button>
						{/if}
					</div>

					<div class="max-h-[24rem] overflow-y-auto">
						{#if !selectedRombel}
							<div class="flex flex-col items-center py-20 text-center">
								<div
									class="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-slate-100"
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
											d="M8 7l4-4m0 0l4 4m-4-4v18"
										/>
									</svg>
								</div>
								<p class="text-sm font-medium text-slate-600">
									Pilih kelas untuk melihat daftar siswa
								</p>
							</div>
						{:else if loadingStudents}
							<div class="flex items-center justify-center py-16">
								<div
									class="h-8 w-8 animate-spin rounded-md border-4 border-slate-200 border-t-emerald-500"
								></div>
							</div>
						{:else if students.length === 0}
							<div class="flex flex-col items-center py-16 text-center">
								<div
									class="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-amber-100"
								>
									<svg
										class="h-6 w-6 text-amber-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
								</div>
								<p class="text-sm font-medium text-slate-600">Tidak ada siswa aktif di kelas ini</p>
								<p class="mt-1 text-xs text-slate-400">Semua siswa mungkin sudah diluluskan</p>
							</div>
						{:else}
							<div class="divide-y divide-slate-100">
								{#each students as student}
									<label
										class="flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
									>
										<div class="relative flex items-center">
											<input
												type="checkbox"
												checked={selectedStudentIds.includes(student.id)}
												on:change={() => toggleStudent(student.id)}
												class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-emerald-500 checked:bg-emerald-500"
											/>
											<svg
												class="pointer-events-none absolute top-1 left-1 h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="3"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<div class="flex-1">
											<p class="font-semibold text-slate-800 capitalize">{student.name}</p>
											<p class="font-mono text-xs text-slate-500">{student.nisn}</p>
										</div>
										<span
											class="rounded-md px-2.5 py-1 text-xs font-semibold {student.gender?.toLowerCase().startsWith('l')
												? 'bg-sky-100 text-sky-700'
												: 'bg-pink-100 text-pink-700'}"
										>
											{student.gender?.toLowerCase().startsWith('l') ? 'Laki-laki' : 'Perempuan'}
										</span>
									</label>
								{/each}
							</div>
						{/if}
					</div>

					{#if selectedStudentIds.length > 0}
						<div class="border-t border-slate-100 bg-slate-50 p-4">
							<button
								on:click={proceedToConfirm}
								class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3.5 font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600"
							>
								Lanjut ke Konfirmasi
								<span class="rounded-md bg-white/20 px-2.5 py-0.5 text-sm"
									>{selectedStudentIds.length} siswa</span
								>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
							</button>
						</div>
					{/if}
				</div>
			</div>
		{:else if activeTab === 'confirm'}
			<!-- Tab 2: Confirmation -->
			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Left: Selected Students -->
				<div class="overflow-hidden rounded-md border border-slate-200 bg-white">
					<div class="border-b border-slate-100 bg-slate-50 px-5 py-4">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
								<svg
									class="h-5 w-5 text-emerald-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-slate-800">Siswa yang Dipilih</h3>
								<p class="text-sm text-slate-500">
									{selectedStudents.length} siswa akan diluluskan
								</p>
							</div>
						</div>
					</div>
					<div class="max-h-[22rem] divide-y divide-slate-100 overflow-y-auto">
						{#each selectedStudents as student, i}
							<div
								class="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50"
							>
								<div class="flex items-center gap-3">
									<span
										class="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500"
										>{i + 1}</span
									>
									<div>
										<p class="font-semibold text-slate-800 capitalize">{student.name}</p>
										<p class="font-mono text-xs text-slate-500">{student.nisn}</p>
									</div>
								</div>
								<button aria-label=""
									on:click={() => toggleStudent(student.id)}
									class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						{/each}
					</div>
				</div>

				<!-- Right: Graduation Form -->
				<div class="space-y-5">
					<div class="overflow-hidden rounded-md border border-slate-200 bg-white">
						<div
							class="border-b border-slate-100 bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4"
						>
							<h3 class="font-semibold text-white">Data Kelulusan</h3>
							<p class="text-sm text-emerald-100">Lengkapi informasi kelulusan</p>
						</div>
						<div class="p-5">
							<!-- Tahun Kelulusan -->
							<div class="mb-5">
								<label for="graduationYear" class="mb-2 block text-sm font-semibold text-slate-700">
									Tahun Kelulusan <span class="text-red-500">*</span>
								</label>
								<select
									id="graduationYear"
									bind:value={graduationYear}
									class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
								>
									<option value="">Pilih tahun ajaran</option>
									{#each academicYears as year}
										<option value={year.name}>
											{year.name}
											{year.isActive === 1 ? '(Aktif)' : ''}
										</option>
									{/each}
								</select>
							</div>

							<!-- Tanggal Kelulusan -->
							<div class="mb-5">
								<label for="completionDate" class="mb-2 block text-sm font-semibold text-slate-700">
									Tanggal Kelulusan <span class="text-red-500">*</span>
								</label>
								<input
									type="date"
									id="completionDate"
									bind:value={completionDate}
									class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
								/>
							</div>

							<div
								class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
							>
								<svg
									class="h-5 w-5 flex-shrink-0 text-amber-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<div class="text-sm text-amber-800">
									<p class="font-semibold">Catatan</p>
									<p class="mt-0.5">
										Nomor ijazah dan predikat dapat diisi nanti melalui halaman detail alumni.
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Summary -->
					<div class="rounded-md border border-slate-200 bg-white p-5">
						<h4 class="mb-4 flex items-center gap-2 font-semibold text-slate-800">
							<svg
								class="h-5 w-5 text-slate-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							Ringkasan
						</h4>
						<div class="grid grid-cols-2 gap-4">
							<div class="rounded-xl bg-slate-50 p-3">
								<p class="text-xs font-medium tracking-wide text-slate-400 uppercase">Kelas</p>
								<p class="mt-1 font-semibold text-slate-800">{selectedRombel?.name || '-'}</p>
							</div>
							<div class="rounded-xl bg-slate-50 p-3">
								<p class="text-xs font-medium tracking-wide text-slate-400 uppercase">
									Jumlah Siswa
								</p>
								<p class="mt-1 font-semibold text-slate-800">{selectedStudentIds.length}</p>
							</div>
							<div class="rounded-xl bg-slate-50 p-3">
								<p class="text-xs font-medium tracking-wide text-slate-400 uppercase">
									Tahun Kelulusan
								</p>
								<p class="mt-1 font-semibold text-slate-800">{graduationYear || '-'}</p>
							</div>
							<div class="rounded-xl bg-slate-50 p-3">
								<p class="text-xs font-medium tracking-wide text-slate-400 uppercase">Tanggal</p>
								<p class="mt-1 font-semibold text-slate-800">{completionDate || '-'}</p>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex gap-3">
						<button
							on:click={() => (activeTab = 'select')}
							class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-semibold text-slate-700 transition-all hover:bg-slate-50"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 17l-5-5m0 0l5-5m-5 5h12"
								/>
							</svg>
							Kembali
						</button>
						<button
							on:click={executeBulkGraduation}
							disabled={isGraduating || !graduationYear || !completionDate}
							class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3.5 font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isGraduating}
								<div
									class="h-5 w-5 animate-spin rounded-md border-2 border-white border-t-transparent"
								></div>
								Memproses...
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Luluskan {selectedStudentIds.length} Siswa
							{/if}
						</button>
					</div>

					<!-- Result -->
					{#if graduationResult}
						<div class="overflow-hidden rounded-md border border-slate-200 bg-white">
							<div class="border-b border-slate-100 bg-slate-50 px-5 py-4">
								<h4 class="font-semibold text-slate-800">Hasil Kelulusan</h4>
							</div>
							<div class="p-5">
								{#if graduationResult.success.length > 0}
									<div class="mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100"
										>
											<svg
												class="h-5 w-5 text-emerald-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<div>
											<p class="font-semibold text-emerald-800">Berhasil</p>
											<p class="text-sm text-emerald-600">
												{graduationResult.success.length} siswa berhasil diluluskan
											</p>
										</div>
									</div>
								{/if}
								{#if graduationResult.failed.length > 0}
									<div class="rounded-xl bg-red-50 p-4">
										<div class="mb-3 flex items-center gap-3">
											<div class="flex h-10 w-10 items-center justify-center rounded-md bg-red-100">
												<svg
													class="h-5 w-5 text-red-600"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</div>
											<div>
												<p class="font-semibold text-red-800">Gagal</p>
												<p class="text-sm text-red-600">
													{graduationResult.failed.length} siswa gagal diluluskan
												</p>
											</div>
										</div>
										<ul class="space-y-1 pl-4 text-sm text-red-700">
											{#each graduationResult.failed as f}
												<li class="flex items-start gap-2">
													<span class="mt-1.5 h-1 w-1 flex-shrink-0 rounded-md bg-red-400"></span>
													{f.name || f.studentId}: {f.error}
												</li>
											{/each}
										</ul>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<ModalAlert
	show={alertModal.show}
	type={alertModal.type}
	message={alertModal.message}
	on:close={() => (alertModal.show = false)}
	on:confirm={() => (alertModal.show = false)}
/>
