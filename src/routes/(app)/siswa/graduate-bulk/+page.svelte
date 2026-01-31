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

<div class="mx-0 md:mx-30">
	<div class="flex flex-col gap-6 p-4 md:p-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/siswa')}
			class="flex w-fit items-center gap-2 rounded-full border bg-green-500 px-4 py-2 text-sm text-green-50 capitalize hover:gap-4 hover:bg-green-700"
		>
			<ArrowLeft />kembali
		</button>

		<!-- Header -->
		<div>
			<p class="text-3xl font-bold text-green-700">Kelulusan Massal</p>
			<p class="text-sm text-gray-600">Luluskan beberapa siswa sekaligus</p>
		</div>

		<!-- Tabs -->
		<div class="flex border-b">
			<button
				on:click={() => (activeTab = 'select')}
				class="border-b-2 px-6 py-3 text-sm font-medium {activeTab === 'select'
					? 'border-green-500 text-green-700'
					: 'border-transparent text-gray-500 hover:text-gray-700'}"
			>
				1. Pilih Siswa
			</button>
			<button
				on:click={() => selectedStudentIds.length > 0 && (activeTab = 'confirm')}
				disabled={selectedStudentIds.length === 0}
				class="border-b-2 px-6 py-3 text-sm font-medium {activeTab === 'confirm'
					? 'border-green-500 text-green-700'
					: 'border-transparent text-gray-500 hover:text-gray-700'} disabled:opacity-50"
			>
				2. Konfirmasi ({selectedStudentIds.length})
			</button>
		</div>

		<!-- Content -->
		{#if isLoading}
			<div class="flex items-center justify-center py-20">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"
				></div>
				<span class="ml-3">Memuat data...</span>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<p class="mb-4 text-red-600">{error}</p>
				<button on:click={fetchRombels} class="rounded-md border px-4 py-2">Coba Lagi</button>
			</div>
		{:else if activeTab === 'select'}
			<!-- Tab 1: Select Students -->
			<div class="grid gap-6 lg:grid-cols-3">
				<!-- Left: Rombel Selection -->
				<div class="rounded-lg border">
					<div class="border-b bg-gray-50 p-4">
						<h3 class="font-semibold">Pilih Kelas</h3>
						<p class="text-sm text-gray-500">Hanya kelas akhir yang ditampilkan</p>
					</div>
					<div class="max-h-96 overflow-y-auto p-4">
						{#if classGroups.length === 0}
							<p class="py-6 text-center text-gray-500">Tidak ada kelas akhir</p>
						{:else}
							{#each classGroups as group}
								<div class="mb-4">
									<p class="mb-2 text-xs font-semibold text-gray-500 uppercase">
										Kelas {group.className}
									</p>
									<div class="space-y-2">
										{#each group.rombels as rom}
											<button
												on:click={() => selectRombel(rom)}
												class="flex w-full items-center justify-between rounded-lg border p-3 text-left
													{selectedRombel?.id === rom.id ? 'border-green-500 bg-green-50' : 'hover:border-gray-400'}"
											>
												<div>
													<p class="font-medium">{rom.name}</p>
													<p class="text-xs text-gray-500">{rom.code}</p>
												</div>
												<span class="text-sm font-bold text-green-600">
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
				<div class="rounded-lg border lg:col-span-2">
					<div class="border-b bg-gray-50 p-4">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="font-semibold">
									{selectedRombel ? `Siswa ${selectedRombel.name}` : 'Pilih kelas terlebih dahulu'}
								</h3>
								<p class="text-sm text-gray-500">
									{selectedStudentIds.length} dari {students.length} dipilih
								</p>
							</div>
							{#if students.length > 0}
								<button on:click={selectAllStudents} class="text-sm text-green-600 hover:underline">
									{selectedStudentIds.length === students.length ? 'Batal Semua' : 'Pilih Semua'}
								</button>
							{/if}
						</div>
					</div>

					<div class="max-h-96 overflow-y-auto">
						{#if !selectedRombel}
							<div class="py-20 text-center text-gray-500">
								Pilih kelas untuk melihat daftar siswa
							</div>
						{:else if loadingStudents}
							<div class="flex items-center justify-center py-10">
								<div
									class="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent"
								></div>
							</div>
						{:else if students.length === 0}
							<div class="py-10 text-center text-gray-500">Tidak ada siswa aktif di kelas ini</div>
						{:else}
							{#each students as student}
								<label class="flex cursor-pointer items-center gap-3 border-b p-3 hover:bg-gray-50">
									<input
										type="checkbox"
										checked={selectedStudentIds.includes(student.id)}
										on:change={() => toggleStudent(student.id)}
										class="h-4 w-4 rounded border-gray-300 text-green-600"
									/>
									<div class="flex-1">
										<p class="font-medium capitalize">{student.name}</p>
										<p class="text-sm text-gray-500">{student.nisn}</p>
									</div>
									<span
										class="rounded px-2 py-1 text-xs {student.gender === 'L'
											? 'bg-blue-100 text-blue-800'
											: 'bg-pink-100 text-pink-800'}"
									>
										{student.gender === 'L' ? 'L' : 'P'}
									</span>
								</label>
							{/each}
						{/if}
					</div>

					{#if selectedStudentIds.length > 0}
						<div class="border-t bg-gray-50 p-4">
							<button
								on:click={proceedToConfirm}
								class="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
							>
								Lanjut ke Konfirmasi ({selectedStudentIds.length} siswa)
							</button>
						</div>
					{/if}
				</div>
			</div>
		{:else if activeTab === 'confirm'}
			<!-- Tab 2: Confirmation -->
			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Left: Selected Students -->
				<div class="rounded-lg border">
					<div class="border-b bg-gray-50 p-4">
						<h3 class="font-semibold">Siswa yang Dipilih ({selectedStudents.length})</h3>
					</div>
					<div class="max-h-80 overflow-y-auto">
						{#each selectedStudents as student, i}
							<div class="flex items-center justify-between border-b p-3">
								<div class="flex items-center gap-3">
									<span class="text-sm text-gray-500">{i + 1}.</span>
									<div>
										<p class="font-medium capitalize">{student.name}</p>
										<p class="text-xs text-gray-500">{student.nisn}</p>
									</div>
								</div>
								<button
									on:click={() => toggleStudent(student.id)}
									class="text-red-500 hover:text-red-700"
								>
									&times;
								</button>
							</div>
						{/each}
					</div>
				</div>

				<!-- Right: Graduation Form -->
				<div class="space-y-4">
					<div class="rounded-lg border p-4">
						<h3 class="mb-4 font-semibold">Data Kelulusan</h3>

						<!-- Tahun Kelulusan -->
						<div class="mb-4">
							<label for="graduationYear" class="mb-1 block text-sm font-medium">
								Tahun Kelulusan <span class="text-red-500">*</span>
							</label>
							<select
								id="graduationYear"
								bind:value={graduationYear}
								class="w-full rounded-md border px-3 py-2 focus:border-green-500 focus:outline-none"
							>
								<option value="">Pilih tahun</option>
								{#each academicYears as year}
									<option value={year.name}>
										{year.name}
										{year.isActive === 1 ? '(Aktif)' : ''}
									</option>
								{/each}
							</select>
						</div>

						<!-- Tanggal Kelulusan -->
						<div class="mb-4">
							<label for="completionDate" class="mb-1 block text-sm font-medium">
								Tanggal Kelulusan <span class="text-red-500">*</span>
							</label>
							<input
								type="date"
								id="completionDate"
								bind:value={completionDate}
								class="w-full rounded-md border px-3 py-2 focus:border-green-500 focus:outline-none"
							/>
						</div>

						<div
							class="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800"
						>
							<p class="font-medium">Catatan:</p>
							<p>Nomor ijazah dan predikat dapat diisi nanti melalui halaman detail alumni.</p>
						</div>
					</div>

					<!-- Summary -->
					<div class="rounded-lg border bg-gray-50 p-4">
						<h4 class="mb-2 font-medium">Ringkasan</h4>
						<ul class="space-y-1 text-sm text-gray-600">
							<li>Kelas: <span class="font-medium">{selectedRombel?.name || '-'}</span></li>
							<li>Jumlah Siswa: <span class="font-medium">{selectedStudentIds.length}</span></li>
							<li>Tahun Kelulusan: <span class="font-medium">{graduationYear || '-'}</span></li>
							<li>Tanggal: <span class="font-medium">{completionDate || '-'}</span></li>
						</ul>
					</div>

					<!-- Actions -->
					<div class="flex gap-3">
						<button
							on:click={() => (activeTab = 'select')}
							class="flex-1 rounded-lg border px-4 py-3 font-medium hover:bg-gray-50"
						>
							Kembali
						</button>
						<button
							on:click={executeBulkGraduation}
							disabled={isGraduating || !graduationYear || !completionDate}
							class="flex-1 rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
						>
							{#if isGraduating}
								Memproses...
							{:else}
								Luluskan {selectedStudentIds.length} Siswa
							{/if}
						</button>
					</div>

					<!-- Result -->
					{#if graduationResult}
						<div class="rounded-lg border p-4">
							<h4 class="mb-2 font-medium">Hasil</h4>
							{#if graduationResult.success.length > 0}
								<p class="text-sm text-green-600">
									Berhasil: {graduationResult.success.length} siswa
								</p>
							{/if}
							{#if graduationResult.failed.length > 0}
								<div class="mt-2">
									<p class="text-sm text-red-600">Gagal: {graduationResult.failed.length}</p>
									<ul class="ml-4 list-disc text-sm text-gray-600">
										{#each graduationResult.failed as f}
											<li>{f.name || f.studentId}: {f.error}</li>
										{/each}
									</ul>
								</div>
							{/if}
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
