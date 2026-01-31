<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';

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

	interface TargetRombel {
		id: number;
		code: string;
		name: string;
		className: string;
		capacity: number;
		currentCount: number;
		availableSlots: number;
	}

	// State
	let activeTab: 'source' | 'action' = 'source';
	let isLoading = true;
	let error: string | null = null;

	// Source data
	let classGroups: ClassGroup[] = [];
	let selectedSourceRombel: Rombel | null = null;
	let sourceStudents: Student[] = [];
	let selectedStudentIds: number[] = [];
	let loadingStudents = false;

	// Target data
	let targetRombels: TargetRombel[] = [];
	let selectedTargetRombelId: number | null = null;
	let loadingTargets = false;

	// Promotion
	let isPromoting = false;
	let promotionResult: { success: any[]; failed: any[] } | null = null;

	// Fetch rombels grouped by class
	async function fetchRombels() {
		isLoading = true;
		error = null;

		try {
			const response = await API_FETCH('/routes/api/promotion/rombels');
			if (!response.ok) throw new Error('Gagal mengambil data rombel');

			const result = await response.json();
			classGroups = result.data || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	// Fetch students from selected rombel
	async function fetchStudents(rombelId: number) {
		loadingStudents = true;
		sourceStudents = [];
		selectedStudentIds = [];

		try {
			const response = await API_FETCH(`/routes/api/promotion/students/${rombelId}`);
			if (!response.ok) throw new Error('Gagal mengambil data siswa');

			const result = await response.json();
			sourceStudents = result.data || [];
		} catch (err) {
			console.error('Error fetching students:', err);
		} finally {
			loadingStudents = false;
		}
	}

	// Fetch target rombels for promotion
	async function fetchTargetRombels(classId: number) {
		loadingTargets = true;
		targetRombels = [];
		selectedTargetRombelId = null;

		try {
			const response = await API_FETCH(`/routes/api/promotion/targets/${classId}`);
			if (!response.ok) throw new Error('Gagal mengambil data rombel tujuan');

			const result = await response.json();
			targetRombels = result.data || [];
		} catch (err) {
			console.error('Error fetching target rombels:', err);
		} finally {
			loadingTargets = false;
		}
	}

	// Handle rombel selection
	function selectSourceRombel(rombel: Rombel) {
		selectedSourceRombel = rombel;
		promotionResult = null;
		fetchStudents(rombel.id);
		fetchTargetRombels(rombel.classId);
		activeTab = 'action';
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
		if (selectedStudentIds.length === sourceStudents.length) {
			selectedStudentIds = [];
		} else {
			selectedStudentIds = sourceStudents.map((s) => s.id);
		}
	}

	// Promote selected students
	async function promoteStudents() {
		if (selectedStudentIds.length === 0) {
			alert('Pilih minimal satu siswa');
			return;
		}

		if (!selectedTargetRombelId) {
			alert('Pilih rombel tujuan');
			return;
		}

		if (!confirm(`Promosikan ${selectedStudentIds.length} siswa ke rombel baru?`)) {
			return;
		}

		isPromoting = true;
		promotionResult = null;

		try {
			const response = await API_FETCH('/routes/api/promotion/promote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					studentIds: selectedStudentIds,
					targetRombelId: selectedTargetRombelId
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal mempromosikan siswa');
			}

			promotionResult = {
				success: result.data.success || [],
				failed: result.data.failed || []
			};

			// Refresh data
			await fetchRombels();
			if (selectedSourceRombel) {
				await fetchStudents(selectedSourceRombel.id);
				await fetchTargetRombels(selectedSourceRombel.classId);
			}

			selectedStudentIds = [];
			alert(`Berhasil mempromosikan ${result.data.successCount} siswa`);
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
		} finally {
			isPromoting = false;
		}
	}

	onMount(() => {
		fetchRombels();
	});
</script>

<div class="mx-0 md:mx-30">
	<div class="flex flex-col gap-6 p-4 md:p-8">
		<!-- Back button -->
		<button
			on:click={() => goto('/score')}
			class="flex w-fit items-center gap-2 rounded-full border bg-green-500 px-4 py-2 text-sm text-green-50 capitalize hover:gap-4 hover:bg-green-700"
		>
			<ArrowLeft />kembali
		</button>

		<!-- Header -->
		<div>
			<p class="text-3xl font-bold text-green-700">Kenaikan Kelas</p>
			<p class="text-sm text-gray-600">Promosikan siswa ke tingkat kelas berikutnya</p>
		</div>

		<!-- Tabs -->
		<div class="flex border-b">
			<button
				on:click={() => (activeTab = 'source')}
				class="border-b-2 px-6 py-3 text-sm font-medium {activeTab === 'source'
					? 'border-green-500 text-green-700'
					: 'border-transparent text-gray-500 hover:text-gray-700'}"
			>
				Pilih Rombel Asal
			</button>
			<button
				on:click={() => (activeTab = 'action')}
				disabled={!selectedSourceRombel}
				class="border-b-2 px-6 py-3 text-sm font-medium {activeTab === 'action'
					? 'border-green-500 text-green-700'
					: 'border-transparent text-gray-500 hover:text-gray-700'} disabled:opacity-50"
			>
				Kelola Kenaikan
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
				<button on:click={fetchRombels} class="rounded-md border px-4 py-2"> Coba Lagi </button>
			</div>
		{:else if activeTab === 'source'}
			<!-- Tab 1: Source Rombel Selection -->
			<div class="grid gap-6">
				{#each classGroups as group}
					<div class="rounded-lg border p-4">
						<div class="mb-4 flex items-center gap-3">
							<h3 class="text-lg font-semibold">Kelas {group.className}</h3>
							{#if group.isFinalGrade}
								<span class="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
									Kelas Akhir - Luluskan
								</span>
							{:else}
								<span class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
									Dapat Dipromosikan
								</span>
							{/if}
						</div>

						<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
							{#each group.rombels as rom}
								<button
									on:click={() => !group.isFinalGrade && selectSourceRombel(rom)}
									disabled={group.isFinalGrade}
									class="flex items-center justify-between rounded-lg border p-4 text-left
										{selectedSourceRombel?.id === rom.id ? 'border-green-500 bg-green-50' : 'hover:border-gray-400'}
										{group.isFinalGrade ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
								>
									<div>
										<p class="font-medium">{rom.name}</p>
										<p class="text-sm text-gray-500">{rom.code}</p>
									</div>
									<div class="text-right">
										<p class="text-lg font-bold text-green-600">{rom.activeStudentCount}</p>
										<p class="text-xs text-gray-500">siswa aktif</p>
									</div>
								</button>
							{/each}
						</div>

						{#if group.isFinalGrade && group.rombels.length > 0}
							<p class="mt-3 text-sm text-yellow-700">
								Siswa kelas akhir harus diluluskan melalui menu
								<a href="/siswa/alumni" class="underline">Alumni</a>
							</p>
						{/if}
					</div>
				{/each}

				{#if classGroups.length === 0}
					<div class="rounded-lg border border-dashed py-20 text-center">
						<p class="opacity-70">Tidak ada rombel tersedia</p>
					</div>
				{/if}
			</div>
		{:else if activeTab === 'action' && selectedSourceRombel}
			<!-- Tab 2: Action Panel -->
			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Left: Student Selection -->
				<div class="rounded-lg border">
					<div class="border-b bg-gray-50 p-4">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="font-semibold">Siswa dari {selectedSourceRombel.name}</h3>
								<p class="text-sm text-gray-500">
									{selectedStudentIds.length} dari {sourceStudents.length} dipilih
								</p>
							</div>
							<button on:click={selectAllStudents} class="text-sm text-green-600 hover:underline">
								{selectedStudentIds.length === sourceStudents.length
									? 'Batal Pilih Semua'
									: 'Pilih Semua'}
							</button>
						</div>
					</div>

					<div class="max-h-96 overflow-y-auto">
						{#if loadingStudents}
							<div class="flex items-center justify-center py-10">
								<div
									class="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent"
								></div>
							</div>
						{:else if sourceStudents.length === 0}
							<div class="py-10 text-center text-gray-500">Tidak ada siswa aktif</div>
						{:else}
							{#each sourceStudents as student}
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
										{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
									</span>
								</label>
							{/each}
						{/if}
					</div>
				</div>

				<!-- Right: Target Selection & Action -->
				<div class="space-y-6">
					<!-- Target Rombel -->
					<div class="rounded-lg border">
						<div class="border-b bg-gray-50 p-4">
							<h3 class="font-semibold">Pilih Rombel Tujuan</h3>
							<p class="text-sm text-gray-500">Kelas tingkat berikutnya</p>
						</div>

						<div class="p-4">
							{#if loadingTargets}
								<div class="flex items-center justify-center py-10">
									<div
										class="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent"
									></div>
								</div>
							{:else if targetRombels.length === 0}
								<div class="py-6 text-center">
									<p class="mb-2 text-gray-500">Tidak ada rombel tujuan tersedia</p>
									<p class="text-sm text-gray-400">Buat rombel baru untuk tingkat berikutnya</p>
								</div>
							{:else}
								<div class="space-y-2">
									{#each targetRombels as target}
										<label
											class="flex cursor-pointer items-center justify-between rounded-lg border p-3
												{selectedTargetRombelId === target.id ? 'border-green-500 bg-green-50' : 'hover:border-gray-400'}"
										>
											<div class="flex items-center gap-3">
												<input
													type="radio"
													name="targetRombel"
													value={target.id}
													bind:group={selectedTargetRombelId}
													class="h-4 w-4 text-green-600"
												/>
												<div>
													<p class="font-medium">{target.name}</p>
													<p class="text-sm text-gray-500">Kelas {target.className}</p>
												</div>
											</div>
											<div class="text-right text-sm">
												<p class={target.availableSlots > 0 ? 'text-green-600' : 'text-red-600'}>
													{target.availableSlots} slot tersedia
												</p>
												<p class="text-gray-500">{target.currentCount}/{target.capacity}</p>
											</div>
										</label>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<!-- Action Button -->
					<div class="rounded-lg border bg-gray-50 p-4">
						<div class="mb-4">
							<h4 class="font-medium">Ringkasan</h4>
							<ul class="mt-2 space-y-1 text-sm text-gray-600">
								<li>Dari: <span class="font-medium">{selectedSourceRombel.name}</span></li>
								<li>
									Ke: <span class="font-medium">
										{targetRombels.find((t) => t.id === selectedTargetRombelId)?.name || '-'}
									</span>
								</li>
								<li>Jumlah siswa: <span class="font-medium">{selectedStudentIds.length}</span></li>
							</ul>
						</div>

						<button
							on:click={promoteStudents}
							disabled={isPromoting || selectedStudentIds.length === 0 || !selectedTargetRombelId}
							class="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isPromoting}
								Memproses...
							{:else}
								Promosikan {selectedStudentIds.length} Siswa
							{/if}
						</button>

						{#if selectedStudentIds.length === 0}
							<p class="mt-2 text-center text-xs text-gray-500">Pilih siswa terlebih dahulu</p>
						{:else if !selectedTargetRombelId}
							<p class="mt-2 text-center text-xs text-gray-500">Pilih rombel tujuan</p>
						{/if}
					</div>

					<!-- Result -->
					{#if promotionResult}
						<div class="rounded-lg border p-4">
							<h4 class="mb-2 font-medium">Hasil Promosi</h4>
							{#if promotionResult.success.length > 0}
								<div class="mb-2">
									<p class="text-sm text-green-600">Berhasil ({promotionResult.success.length}):</p>
									<ul class="ml-4 list-disc text-sm text-gray-600">
										{#each promotionResult.success.slice(0, 5) as s}
											<li class="capitalize">{s.name}</li>
										{/each}
										{#if promotionResult.success.length > 5}
											<li>...dan {promotionResult.success.length - 5} lainnya</li>
										{/if}
									</ul>
								</div>
							{/if}
							{#if promotionResult.failed.length > 0}
								<div>
									<p class="text-sm text-red-600">Gagal ({promotionResult.failed.length}):</p>
									<ul class="ml-4 list-disc text-sm text-gray-600">
										{#each promotionResult.failed as f}
											<li>{f.name || f.studentId}: {f.reason}</li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="rounded-lg border border-dashed py-20 text-center">
				<p class="opacity-70">Pilih rombel asal terlebih dahulu</p>
			</div>
		{/if}
	</div>
</div>
