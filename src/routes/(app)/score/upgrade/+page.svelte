<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

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

	// Modal alert state
	let showAlert = false;
	let alertType: 'success' | 'error' | 'warning' | 'info' = 'warning';
	let alertMessage = '';
	let alertShowCancel = false;
	let alertConfirmText = 'OK';
	let alertCancelText = 'Batal';
	let alertOnConfirm: (() => void) | null = null;

	// Computed
	$: selectedTarget = targetRombels.find((t) => t.id === selectedTargetRombelId);
	$: allSelected = sourceStudents.length > 0 && selectedStudentIds.length === sourceStudents.length;
	$: canPromote = selectedStudentIds.length > 0 && selectedTargetRombelId !== null && !isPromoting;

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

	function selectSourceRombel(rombel: Rombel) {
		selectedSourceRombel = rombel;
		promotionResult = null;
		fetchStudents(rombel.id);
		fetchTargetRombels(rombel.classId);
		activeTab = 'action';
	}

	function goBackToSource() {
		activeTab = 'source';
		selectedSourceRombel = null;
		sourceStudents = [];
		selectedStudentIds = [];
		targetRombels = [];
		selectedTargetRombelId = null;
		promotionResult = null;
	}

	function toggleStudent(studentId: number) {
		if (selectedStudentIds.includes(studentId)) {
			selectedStudentIds = selectedStudentIds.filter((id) => id !== studentId);
		} else {
			selectedStudentIds = [...selectedStudentIds, studentId];
		}
	}

	function selectAllStudents() {
		if (allSelected) {
			selectedStudentIds = [];
		} else {
			selectedStudentIds = sourceStudents.map((s) => s.id);
		}
	}

	function showModalAlert(
		msg: string,
		type: 'success' | 'error' | 'warning' | 'info' = 'warning',
		options?: { showCancel?: boolean; confirmText?: string; onConfirm?: () => void }
	) {
		alertMessage = msg;
		alertType = type;
		alertShowCancel = options?.showCancel ?? false;
		alertConfirmText = options?.confirmText ?? 'OK';
		alertOnConfirm = options?.onConfirm ?? null;
		showAlert = true;
	}

	async function executePromotion() {
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

			await fetchRombels();
			if (selectedSourceRombel) {
				await fetchStudents(selectedSourceRombel.id);
				await fetchTargetRombels(selectedSourceRombel.classId);
			}

			selectedStudentIds = [];
		} catch (err) {
			showModalAlert(err instanceof Error ? err.message : 'Terjadi kesalahan', 'error');
		} finally {
			isPromoting = false;
		}
	}

	function promoteStudents() {
		if (selectedStudentIds.length === 0) {
			showModalAlert('Pilih minimal satu siswa', 'warning');
			return;
		}

		if (!selectedTargetRombelId) {
			showModalAlert('Pilih rombel tujuan', 'warning');
			return;
		}

		showModalAlert(`Promosikan ${selectedStudentIds.length} siswa ke rombel baru?`, 'info', {
			showCancel: true,
			confirmText: 'Promosikan',
			onConfirm: executePromotion
		});
	}

	onMount(() => {
		fetchRombels();
	});
</script>

<div class="mx-auto w-full max-w-full space-y-6 p-6">
	<!-- Header -->
	<button
		on:click={() => goto('/score')}
		class="flex items-center justify-center gap-2 rounded-full border border-emerald-200 px-4 py-1.5 text-emerald-500 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
	>
		<ArrowLeft /> kembali
	</button>
	<div
		class="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center"
	>
		<div class="flex items-center gap-4">
			<div>
				<h1 class="text-2xl font-bold text-slate-800">Kenaikan Kelas</h1>
				<p class="mt-0.5 text-sm text-slate-500">Promosikan siswa ke tingkat kelas berikutnya</p>
			</div>
		</div>
	</div>

	<!-- Stepper -->
	<div class="flex items-center gap-3">
		<button
			on:click={() => {
				if (activeTab === 'action') goBackToSource();
			}}
			class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
				{activeTab === 'source'
				? 'bg-emerald-50 text-emerald-700'
				: 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}"
		>
			<span
				class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
				{activeTab === 'source' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}">1</span
			>
			Pilih Rombel
		</button>

		<svg class="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>

		<div
			class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
			{activeTab === 'action' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-300'}"
		>
			<span
				class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
				{activeTab === 'action' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'}">2</span
			>
			Kelola Kenaikan
		</div>

		{#if selectedSourceRombel && activeTab === 'action'}
			<div class="ml-auto hidden items-center gap-2 sm:flex">
				<span class="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
					{selectedSourceRombel.name}
				</span>
			</div>
		{/if}
	</div>

	<!-- Content -->
	{#if isLoading}
		<div class="flex flex-col items-center justify-center py-20">
			<div
				class="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600"
			></div>
			<span class="mt-3 text-sm text-slate-400">Memuat data rombel...</span>
		</div>
	{:else if error}
		<div class="flex flex-col items-center justify-center py-20">
			<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
				<svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<p class="mb-1 text-sm font-medium text-slate-700">{error}</p>
			<button
				on:click={fetchRombels}
				class="mt-3 rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
			>
				Coba Lagi
			</button>
		</div>
	{:else if activeTab === 'source'}
		<!-- Step 1: Source Rombel Selection -->
		<div class="space-y-4">
			{#each classGroups as group}
				<div class="rounded-lg border border-slate-200 bg-white">
					<!-- Class header -->
					<div class="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
						<h3 class="text-sm font-semibold text-slate-800">Kelas {group.className}</h3>
						{#if group.isFinalGrade}
							<span class="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
								>Kelas Akhir</span
							>
						{:else}
							<span
								class="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
								>Dapat Naik</span
							>
						{/if}
					</div>

					<!-- Rombel cards -->
					<div class="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each group.rombels as rom}
							<button
								on:click={() => !group.isFinalGrade && selectSourceRombel(rom)}
								disabled={group.isFinalGrade}
								class="group flex items-center justify-between rounded-lg border p-4 text-left transition-all duration-200
									{selectedSourceRombel?.id === rom.id
									? 'border-emerald-400 bg-emerald-50 shadow-sm'
									: group.isFinalGrade
										? 'cursor-not-allowed border-slate-100 opacity-50'
										: 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-sm'}"
							>
								<div>
									<p class="font-medium text-slate-800">{rom.name}</p>
									<p class="mt-0.5 text-xs text-slate-400">{rom.code}</p>
								</div>
								<div class="text-right">
									<p class="text-xl font-bold text-emerald-600">{rom.activeStudentCount}</p>
									<p class="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
										siswa
									</p>
								</div>
							</button>
						{/each}
					</div>

					{#if group.isFinalGrade && group.rombels.length > 0}
						<div class="border-t border-slate-100 px-5 py-3">
							<p class="text-xs text-amber-600">
								Siswa kelas akhir harus diluluskan melalui menu
								<a
									href="/siswa/alumni"
									class="font-medium underline underline-offset-2 hover:text-amber-700">Alumni</a
								>
							</p>
						</div>
					{/if}
				</div>
			{/each}

			{#if classGroups.length === 0}
				<div
					class="flex flex-col items-center rounded-lg border border-dashed border-slate-200 py-20"
				>
					<svg
						class="mb-3 h-10 w-10 text-slate-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
					<p class="text-sm text-slate-400">Tidak ada rombel tersedia</p>
				</div>
			{/if}
		</div>
	{:else if activeTab === 'action' && selectedSourceRombel}
		<!-- Step 2: Action Panel -->
		<div class="grid gap-6 lg:grid-cols-5">
			<!-- Left: Student Selection (3 cols) -->
			<div class="overflow-hidden rounded-lg border border-slate-200 bg-white lg:col-span-3">
				<!-- Student list header -->
				<div class="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
					<div>
						<h3 class="text-sm font-semibold text-slate-800">Daftar Siswa</h3>
						<p class="mt-0.5 text-xs text-slate-400">
							{selectedStudentIds.length} dari {sourceStudents.length} siswa dipilih
						</p>
					</div>
					{#if sourceStudents.length > 0}
						<button
							on:click={selectAllStudents}
							class="rounded-md px-2.5 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
						>
							{allSelected ? 'Batal Semua' : 'Pilih Semua'}
						</button>
					{/if}
				</div>

				<!-- Selection progress bar -->
				{#if sourceStudents.length > 0}
					<div class="h-1 w-full bg-slate-50">
						<div
							class="h-full bg-emerald-500 transition-all duration-300"
							style="width: {(selectedStudentIds.length / sourceStudents.length) * 100}%"
						></div>
					</div>
				{/if}

				<!-- Student list -->
				<div class="max-h-112 overflow-y-auto">
					{#if loadingStudents}
						<div class="flex flex-col items-center justify-center py-14">
							<div
								class="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600"
							></div>
							<span class="mt-2 text-xs text-slate-400">Memuat siswa...</span>
						</div>
					{:else if sourceStudents.length === 0}
						<div class="flex flex-col items-center py-14">
							<svg
								class="mb-2 h-8 w-8 text-slate-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<p class="text-sm text-slate-400">Tidak ada siswa aktif</p>
						</div>
					{:else}
						<div class="divide-y divide-slate-50">
							{#each sourceStudents as student, i}
								<label
									class="flex cursor-pointer items-center gap-3.5 px-5 py-3 transition-colors
										{selectedStudentIds.includes(student.id) ? 'bg-emerald-50/60' : 'hover:bg-slate-50'}"
								>
									<div class="relative flex items-center">
										<input
											type="checkbox"
											checked={selectedStudentIds.includes(student.id)}
											on:change={() => toggleStudent(student.id)}
											class="peer h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
										/>
									</div>
									<div class="flex flex-1 items-center justify-between">
										<div>
											<p class="text-sm font-medium text-slate-800 capitalize">{student.name}</p>
											<p class="text-xs text-slate-400">{student.nisn}</p>
										</div>
										<span
											class="rounded-md px-2 py-0.5 text-[10px] font-medium
											{student.gender?.toLowerCase().startsWith('l') ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}"
										>
											{student.gender?.toLowerCase().startsWith('l') ? 'L' : 'P'}
										</span>
									</div>
								</label>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Right: Target + Action (2 cols) -->
			<div class="space-y-4 lg:col-span-2">
				<!-- Target Rombel -->
				<div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
					<div class="border-b border-slate-100 px-5 py-3.5">
						<h3 class="text-sm font-semibold text-slate-800">Rombel Tujuan</h3>
						<p class="mt-0.5 text-xs text-slate-400">Pilih kelas tingkat berikutnya</p>
					</div>

					<div class="p-3">
						{#if loadingTargets}
							<div class="flex items-center justify-center py-10">
								<div
									class="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600"
								></div>
							</div>
						{:else if targetRombels.length === 0}
							<div class="flex flex-col items-center py-8">
								<p class="text-sm text-slate-400">Tidak ada rombel tujuan</p>
								<p class="mt-1 text-xs text-slate-300">Buat rombel baru untuk tingkat berikutnya</p>
							</div>
						{:else}
							<div class="space-y-2">
								{#each targetRombels as target}
									<label
										class="flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all duration-200
											{selectedTargetRombelId === target.id
											? 'border-emerald-400 bg-emerald-50 shadow-sm'
											: 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}"
									>
										<div class="flex items-center gap-3">
											<input
												type="radio"
												name="targetRombel"
												value={target.id}
												bind:group={selectedTargetRombelId}
												class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
											/>
											<div>
												<p class="text-sm font-medium text-slate-800">{target.name}</p>
												<p class="text-xs text-slate-400">Kelas {target.className}</p>
											</div>
										</div>
										<div class="text-right">
											<p
												class="text-xs font-medium {target.availableSlots > 0
													? 'text-emerald-600'
													: 'text-red-500'}"
											>
												{target.availableSlots} slot
											</p>
											<p class="text-[10px] text-slate-400">
												{target.currentCount}/{target.capacity}
											</p>
										</div>
									</label>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Summary + Action -->
				<div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
					<div class="border-b border-slate-100 px-5 py-3.5">
						<h3 class="text-sm font-semibold text-slate-800">Ringkasan</h3>
					</div>
					<div class="space-y-3 p-5">
						<!-- Route summary -->
						<div class="flex items-center gap-3">
							<!-- Source -->
							<div class="flex shrink-0 flex-col items-center">
								<span class="mb-1 text-[11px] font-medium text-emerald-600">Asal</span>
								<div
									class="h-4 w-4 rounded-full border-[3px] border-emerald-500 bg-emerald-100"
								></div>
								<p class="mt-1.5 text-xs font-semibold text-slate-800">
									{selectedSourceRombel.name}
								</p>
								<p class="text-[11px] text-slate-400">{selectedSourceRombel.className}</p>
							</div>

							<!-- Dashed line -->
							<div
								class="mt-3 h-0.5 flex-1 {selectedStudentIds.length > 0
									? 'promotion-line-active'
									: 'promotion-line-idle'}"
							></div>

							<!-- Target -->
							<div class="flex shrink-0 flex-col items-center">
								<span class="mb-1 text-[11px] font-medium text-blue-600">Tujuan</span>
								<div class="h-4 w-4 rounded-full border-[3px] border-blue-500 bg-blue-100"></div>
								<p class="mt-1.5 text-xs font-semibold text-slate-800">
									{selectedTarget?.name || '-'}
								</p>
								<p class="text-[11px] text-slate-400">{selectedTarget?.className || ''}</p>
							</div>
						</div>

						<div class="h-px bg-slate-100"></div>

						<!-- Student count -->
						<div class="flex items-center justify-between text-sm">
							<span class="text-slate-500">Siswa dipilih</span>
							<span class="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
								{selectedStudentIds.length}
							</span>
						</div>

						<!-- Action button -->
						<button
							on:click={promoteStudents}
							disabled={!canPromote}
							class="flex w-full items-center justify-center gap-2 rounded-sm px-4 py-3 text-sm font-semibold transition-all duration-200
								{canPromote
								? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md'
								: 'cursor-not-allowed bg-slate-100 text-slate-400'}"
						>
							{#if isPromoting}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
								></div>
								Memproses...
							{:else}
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 10l7-7m0 0l7 7m-7-7v18"
									/>
								</svg>
								naikkan {selectedStudentIds.length} Siswa
							{/if}
						</button>

						{#if !canPromote && !isPromoting}
							<p class="text-center text-[11px] text-slate-400">
								{#if selectedStudentIds.length === 0}
									Pilih siswa terlebih dahulu
								{:else if !selectedTargetRombelId}
									Pilih rombel tujuan
								{/if}
							</p>
						{/if}
					</div>
				</div>

				<!-- Promotion Result -->
				{#if promotionResult}
					<div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
						<div class="border-b border-slate-100 px-5 py-3.5">
							<h3 class="text-sm font-semibold text-slate-800">Hasil kenaikan</h3>
						</div>
						<div class="space-y-3 p-5">
							{#if promotionResult.success.length > 0}
								<div>
									<div class="mb-2 flex items-center gap-1.5">
										<span class="h-2 w-2 rounded-full bg-emerald-500"></span>
										<span class="text-xs font-medium text-emerald-700"
											>Berhasil ({promotionResult.success.length})</span
										>
									</div>
									<div class="space-y-1 pl-3.5">
										{#each promotionResult.success.slice(0, 5) as s}
											<p class="text-xs text-slate-600 capitalize">{s.name}</p>
										{/each}
										{#if promotionResult.success.length > 5}
											<p class="text-xs text-slate-400">
												...dan {promotionResult.success.length - 5} lainnya
											</p>
										{/if}
									</div>
								</div>
							{/if}
							{#if promotionResult.failed.length > 0}
								<div>
									<div class="mb-2 flex items-center gap-1.5">
										<span class="h-2 w-2 rounded-full bg-red-500"></span>
										<span class="text-xs font-medium text-red-600"
											>Gagal ({promotionResult.failed.length})</span
										>
									</div>
									<div class="space-y-1 pl-3.5">
										{#each promotionResult.failed as f}
											<p class="text-xs text-slate-600">
												{f.name || f.studentId}: <span class="text-red-500">{f.reason}</span>
											</p>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Fallback: no source selected -->
		<div class="flex flex-col items-center rounded-lg border border-dashed border-slate-200 py-20">
			<svg
				class="mb-3 h-10 w-10 text-slate-300"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
				/>
			</svg>
			<p class="text-sm text-slate-400">Pilih rombel asal terlebih dahulu</p>
		</div>
	{/if}
</div>

<ModalAlert
	bind:show={showAlert}
	type={alertType}
	message={alertMessage}
	showCancel={alertShowCancel}
	confirmText={alertConfirmText}
	cancelText={alertCancelText}
	on:confirm={() => {
		if (alertOnConfirm) alertOnConfirm();
	}}
/>

<style>
	:global(.promotion-line-idle) {
		background-image: repeating-linear-gradient(
			to right,
			#e5e7eb 0px,
			#e5e7eb 6px,
			transparent 6px,
			transparent 12px
		);
	}

	:global(.promotion-line-active) {
		background-image: repeating-linear-gradient(
			to right,
			#10b981 0px,
			#10b981 6px,
			transparent 6px,
			transparent 12px
		);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0%,
			rgba(0, 0, 0, 0.03) 15%,
			rgba(0, 0, 0, 0.15) 30%,
			rgba(0, 0, 0, 0.5) 42%,
			black 50%,
			transparent 56%,
			transparent 100%
		);
		mask-image: linear-gradient(
			to right,
			transparent 0%,
			rgba(0, 0, 0, 0.03) 15%,
			rgba(0, 0, 0, 0.15) 30%,
			rgba(0, 0, 0, 0.5) 42%,
			black 50%,
			transparent 56%,
			transparent 100%
		);
		-webkit-mask-size: 300% 100%;
		mask-size: 300% 100%;
		animation: pulse-sweep 2s ease-in-out infinite;
	}

	@keyframes pulse-sweep {
		0% {
			-webkit-mask-position: 100% 0;
			mask-position: 100% 0;
		}
		100% {
			-webkit-mask-position: 0 0;
			mask-position: 0 0;
		}
	}
</style>
