<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import AddIcon from '$lib/components/icons/addIcon.svelte';
	import { API_FETCH } from '$lib/api';

	// ==================== TYPES ====================
	interface Subject {
		id: number;
		name: string;
		subjectCode: string;
		description: string;
		kkm: number;
	}

	interface ClassSubject {
		id: number;
		classId: number;
		className: string;
		subjectId: number;
		subjectName: string;
		subjectCode: string;
		teacherId: number | null;
		teacherName: string | null;
	}

	interface DropdownItem {
		id: number;
		name: string;
		code?: string;
	}

	// ==================== STATE ====================
	// Tab state
	let activeTab: 'subjects' | 'assignments' = 'subjects';

	// Subjects tab state
	let subjects: Subject[] = [];
	let isLoading = false;
	let isSubmitting = false;
	let showModal = false;
	let isEditing = false;
	let currentSubject: Subject = {
		id: 0,
		name: '',
		subjectCode: '',
		description: '',
		kkm: 75
	};
	let error = '';

	const emptySubject: Subject = {
		id: 0,
		name: '',
		subjectCode: '',
		description: '',
		kkm: 75
	};

	// Assignments tab state
	let classSubjects: ClassSubject[] = [];
	let selectedClassFilter: number | null = null;
	let classesDropdown: DropdownItem[] = [];
	let subjectsDropdown: DropdownItem[] = [];
	let teachersDropdown: DropdownItem[] = [];
	let unassignedSubjects: DropdownItem[] = [];

	let showAssignModal = false;
	let isEditingAssign = false;
	let currentAssignment = {
		id: 0,
		classId: 0,
		subjectId: 0,
		teacherId: null as number | null
	};

	// ==================== SUBJECTS TAB FUNCTIONS ====================
	async function fetchSubjects() {
		isLoading = true;
		error = '';
		try {
			const response = await API_FETCH('/routes/api/subjects');
			const data = await response.json();
			if (data.success) {
				subjects = data.data;
			} else {
				error = data.message || 'Gagal memuat data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error fetching subjects:', err);
		} finally {
			isLoading = false;
		}
	}

	function handleAddClick() {
		currentSubject = { ...emptySubject };
		isEditing = false;
		showModal = true;
	}

	function handleEditClick(subject: Subject) {
		currentSubject = { ...subject };
		isEditing = true;
		showModal = true;
	}

	function handleCloseModal() {
		showModal = false;
		currentSubject = { ...emptySubject };
		isEditing = false;
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleCloseModal();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (showModal) handleCloseModal();
			if (showAssignModal) handleCloseAssignModal();
		}
	}

	async function handleSubmit() {
		if (!currentSubject.name.trim()) {
			error = 'Nama mata pelajaran harus diisi';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			let response;
			if (isEditing && currentSubject.id) {
				response = await API_FETCH(`/routes/api/subjects/${currentSubject.id}`, {
					method: 'PUT',
					body: JSON.stringify({
						name: currentSubject.name,
						subjectCode: currentSubject.subjectCode,
						description: currentSubject.description,
						kkm: currentSubject.kkm
					})
				});
			} else {
				response = await API_FETCH('/routes/api/subjects', {
					method: 'POST',
					body: JSON.stringify({
						name: currentSubject.name,
						subjectCode: currentSubject.subjectCode,
						description: currentSubject.description,
						kkm: currentSubject.kkm
					})
				});
			}

			const data = await response.json();
			if (data.success) {
				await fetchSubjects();
				handleCloseModal();
			} else {
				error = data.message || 'Gagal menyimpan data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error saving subject:', err);
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete(subject: Subject) {
		if (!confirm(`Apakah Anda yakin ingin menghapus "${subject.name}"?`)) {
			return;
		}

		isLoading = true;
		error = '';

		try {
			const response = await API_FETCH(`/routes/api/subjects/${subject.id}`, {
				method: 'DELETE'
			});

			const data = await response.json();
			if (data.success) {
				await fetchSubjects();
			} else {
				error = data.message || 'Gagal menghapus data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error deleting subject:', err);
		} finally {
			isLoading = false;
		}
	}

	// ==================== ASSIGNMENTS TAB FUNCTIONS ====================
	async function fetchClassSubjects() {
		isLoading = true;
		error = '';
		try {
			let url = '/routes/api/class-subjects';
			if (selectedClassFilter) {
				url += `?classId=${selectedClassFilter}`;
			}
			const response = await API_FETCH(url);
			const data = await response.json();
			if (data.success) {
				classSubjects = data.data;
			} else {
				error = data.message || 'Gagal memuat data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error fetching class-subjects:', err);
		} finally {
			isLoading = false;
		}
	}

	async function fetchDropdowns() {
		try {
			const [classesRes, subjectsRes, teachersRes] = await Promise.all([
				API_FETCH('/routes/api/class-subjects/dropdown/classes'),
				API_FETCH('/routes/api/class-subjects/dropdown/subjects'),
				API_FETCH('/routes/api/class-subjects/dropdown/teachers')
			]);

			const classesData = await classesRes.json();
			const subjectsData = await subjectsRes.json();
			const teachersData = await teachersRes.json();

			if (classesData.success) classesDropdown = classesData.data;
			if (subjectsData.success) subjectsDropdown = subjectsData.data;
			if (teachersData.success) teachersDropdown = teachersData.data;
		} catch (err) {
			console.error('Error fetching dropdowns:', err);
		}
	}

	async function fetchUnassignedSubjects(classId: number) {
		try {
			const response = await API_FETCH(`/routes/api/class-subjects/unassigned/${classId}`);
			const data = await response.json();
			if (data.success) {
				unassignedSubjects = data.data;
			}
		} catch (err) {
			console.error('Error fetching unassigned subjects:', err);
		}
	}

	function handleClassFilterChange() {
		fetchClassSubjects();
	}

	function handleAddAssignClick() {
		if (!selectedClassFilter) {
			error = 'Pilih kelas terlebih dahulu';
			return;
		}
		currentAssignment = {
			id: 0,
			classId: selectedClassFilter,
			subjectId: 0,
			teacherId: null
		};
		isEditingAssign = false;
		fetchUnassignedSubjects(selectedClassFilter);
		showAssignModal = true;
	}

	function handleEditAssignClick(cs: ClassSubject) {
		currentAssignment = {
			id: cs.id,
			classId: cs.classId,
			subjectId: cs.subjectId,
			teacherId: cs.teacherId
		};
		isEditingAssign = true;
		showAssignModal = true;
	}

	function handleCloseAssignModal() {
		showAssignModal = false;
		currentAssignment = { id: 0, classId: 0, subjectId: 0, teacherId: null };
		isEditingAssign = false;
		error = '';
	}

	function handleAssignBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleCloseAssignModal();
		}
	}

	async function handleAssignSubmit() {
		if (!currentAssignment.classId || !currentAssignment.subjectId) {
			error = 'Kelas dan Mata Pelajaran wajib dipilih';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			let response;
			if (isEditingAssign && currentAssignment.id) {
				response = await API_FETCH(`/routes/api/class-subjects/${currentAssignment.id}`, {
					method: 'PUT',
					body: JSON.stringify({
						teacherId: currentAssignment.teacherId
					})
				});
			} else {
				response = await API_FETCH('/routes/api/class-subjects', {
					method: 'POST',
					body: JSON.stringify({
						classId: currentAssignment.classId,
						subjectId: currentAssignment.subjectId,
						teacherId: currentAssignment.teacherId
					})
				});
			}

			const data = await response.json();
			if (data.success) {
				await fetchClassSubjects();
				handleCloseAssignModal();
			} else {
				error = data.message || 'Gagal menyimpan data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error saving assignment:', err);
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDeleteAssign(cs: ClassSubject) {
		if (!confirm(`Hapus penugasan "${cs.subjectName}" dari kelas ${cs.className}?`)) {
			return;
		}

		isLoading = true;
		error = '';

		try {
			const response = await API_FETCH(`/routes/api/class-subjects/${cs.id}`, {
				method: 'DELETE'
			});

			const data = await response.json();
			if (data.success) {
				await fetchClassSubjects();
			} else {
				error = data.message || 'Gagal menghapus data';
			}
		} catch (err) {
			error = 'Gagal terhubung ke server';
			console.error('Error deleting assignment:', err);
		} finally {
			isLoading = false;
		}
	}

	// ==================== LIFECYCLE ====================
	onMount(async () => {
		await fetchSubjects();
		await fetchDropdowns();
	});

	// Track if assignments tab has been loaded
	let assignmentsLoaded = false;

	// Watch for tab changes
	$: if (activeTab === 'assignments' && !assignmentsLoaded && !isLoading) {
		assignmentsLoaded = true;
		fetchClassSubjects();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header Section -->
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-bold text-blue-600 sm:text-3xl md:text-4xl">
				Manajemen Mata Pelajaran
			</h1>
			<p class="text-gray-600">Kelola data mata pelajaran dan penugasan guru.</p>
		</div>

		<!-- Tabs -->
		<div class="mt-6 border-b border-gray-200">
			<nav class="-mb-px flex gap-4">
				<button
					on:click={() => (activeTab = 'subjects')}
					class="border-b-2 px-1 py-3 text-sm font-medium transition-colors {activeTab ===
					'subjects'
						? 'border-blue-600 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
				>
					Daftar Mata Pelajaran
				</button>
				<button
					on:click={() => (activeTab = 'assignments')}
					class="border-b-2 px-1 py-3 text-sm font-medium transition-colors {activeTab ===
					'assignments'
						? 'border-blue-600 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
				>
					Penugasan Mapel & Guru
				</button>
			</nav>
		</div>

		<!-- Error Message -->
		{#if error && !showModal && !showAssignModal}
			<div
				class="mt-4 rounded-md bg-red-50 p-4 text-red-700"
				transition:fly={{ y: -10, duration: 300 }}
			>
				{error}
			</div>
		{/if}

		<!-- Tab Content -->
		{#if activeTab === 'subjects'}
			<!-- SUBJECTS TAB -->
			<div class="mt-6">
				<button
					on:click={handleAddClick}
					class="flex w-fit items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-blue-50 capitalize transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-95"
				>
					<AddIcon /> tambah mata pelajaran
				</button>
			</div>

			<div class="mt-6">
				<div class="w-full overflow-hidden rounded-xl border border-gray-300 bg-white">
					<header class="border-b border-gray-200 bg-gray-50 px-6 py-4">
						<h2 class="text-lg font-semibold text-gray-900">Daftar Mata Pelajaran</h2>
					</header>

					{#if isLoading && subjects.length === 0}
						<div class="flex items-center justify-center py-12">
							<svg class="h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
									fill="none"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							<span class="ml-2 text-gray-600">Memuat data...</span>
						</div>
					{:else if subjects.length === 0}
						<div class="py-12 text-center text-gray-500">
							<svg
								class="mx-auto h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
							<p class="mt-2">Belum ada data mata pelajaran</p>
							<button on:click={handleAddClick} class="mt-2 text-blue-600 hover:underline">
								Tambah mata pelajaran pertama
							</button>
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-left text-sm text-gray-600">
								<thead class="bg-gray-50 text-xs text-gray-700 uppercase">
									<tr>
										<th scope="col" class="px-6 py-3 font-medium">No</th>
										<th scope="col" class="px-6 py-3 font-medium">Kode</th>
										<th scope="col" class="px-6 py-3 font-medium">Mata Pelajaran</th>
										<th scope="col" class="px-6 py-3 font-medium">KKM</th>
										<th scope="col" class="px-6 py-3 font-medium">Deskripsi</th>
										<th scope="col" class="px-6 py-3 text-right font-medium">Aksi</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									{#each subjects as subject, index (subject.id)}
										<tr
											class="transition-colors duration-150 hover:bg-gray-50"
											in:fly={{ y: 20, duration: 300, delay: index * 50 }}
										>
											<td class="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
											<td class="px-6 py-4">
												{#if subject.subjectCode}
													<span
														class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
													>
														{subject.subjectCode}
													</span>
												{:else}
													<span class="text-gray-400">-</span>
												{/if}
											</td>
											<td class="px-6 py-4 font-medium text-gray-900">{subject.name}</td>
											<td class="px-6 py-4">
												<span
													class="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700"
												>
													{subject.kkm}
												</span>
											</td>
											<td class="max-w-xs truncate px-6 py-4" title={subject.description || ''}>
												{subject.description || '-'}
											</td>
											<td class="px-6 py-4 text-right">
												<div class="flex justify-end gap-2">
													<button
														on:click={() => handleEditClick(subject)}
														class="rounded p-1.5 text-blue-600 transition-all duration-200 hover:scale-110 hover:bg-blue-50 active:scale-95"
														title="Edit"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="h-5 w-5"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
															/>
														</svg>
													</button>
													<button
														on:click={() => handleDelete(subject)}
														class="rounded p-1.5 text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 active:scale-95"
														title="Hapus"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="h-5 w-5"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															/>
														</svg>
													</button>
												</div>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<div
							class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3"
						>
							<div class="text-sm text-gray-500">
								Total <span class="font-medium">{subjects.length}</span> mata pelajaran
							</div>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<!-- ==================== ASSIGNMENTS TAB ==================== -->
			<div class="mt-6 flex flex-wrap items-center gap-4">
				<!-- Class Filter -->
				<div class="flex items-center gap-2">
					<label for="classFilter" class="text-sm font-medium text-gray-700">Kelas:</label>
					<select
						id="classFilter"
						bind:value={selectedClassFilter}
						on:change={handleClassFilterChange}
						class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
					>
						<option value={null}>-- Pilih Kelas --</option>
						{#each classesDropdown as cls (cls.id)}
							<option value={cls.id}>{cls.name}</option>
						{/each}
					</select>
				</div>

				{#if selectedClassFilter}
					<button
						on:click={handleAddAssignClick}
						class="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-all hover:bg-blue-700 active:scale-95"
					>
						<AddIcon /> Tambah Mapel
					</button>
				{/if}
			</div>

			<div class="mt-6">
				<div class="w-full overflow-hidden rounded-xl border border-gray-300 bg-white">
					<header class="border-b border-gray-200 bg-gray-50 px-6 py-4">
						<h2 class="text-lg font-semibold text-gray-900">
							Penugasan Mapel & Guru
							{#if selectedClassFilter}
								<span class="text-blue-600">
									- {classesDropdown.find((c) => c.id === selectedClassFilter)?.name || ''}
								</span>
							{/if}
						</h2>
					</header>

					{#if !selectedClassFilter}
						<div class="py-12 text-center text-gray-500">
							<svg
								class="mx-auto h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								/>
							</svg>
							<p class="mt-2">Pilih kelas untuk melihat penugasan mata pelajaran</p>
						</div>
					{:else if isLoading}
						<div class="flex items-center justify-center py-12">
							<svg class="h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
									fill="none"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							<span class="ml-2 text-gray-600">Memuat data...</span>
						</div>
					{:else if classSubjects.length === 0}
						<div class="py-12 text-center text-gray-500">
							<p>Belum ada mata pelajaran yang ditugaskan ke kelas ini</p>
							<button on:click={handleAddAssignClick} class="mt-2 text-blue-600 hover:underline">
								Tambah penugasan pertama
							</button>
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-left text-sm text-gray-600">
								<thead class="bg-gray-50 text-xs text-gray-700 uppercase">
									<tr>
										<th scope="col" class="px-6 py-3 font-medium">No</th>
										<th scope="col" class="px-6 py-3 font-medium">Kode</th>
										<th scope="col" class="px-6 py-3 font-medium">Mata Pelajaran</th>
										<th scope="col" class="px-6 py-3 font-medium">Guru Pengampu</th>
										<th scope="col" class="px-6 py-3 text-right font-medium">Aksi</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									{#each classSubjects as cs, index (cs.id)}
										<tr
											class="transition-colors duration-150 hover:bg-gray-50"
											in:fly={{ y: 20, duration: 300, delay: index * 50 }}
										>
											<td class="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
											<td class="px-6 py-4">
												{#if cs.subjectCode}
													<span
														class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
													>
														{cs.subjectCode}
													</span>
												{:else}
													<span class="text-gray-400">-</span>
												{/if}
											</td>
											<td class="px-6 py-4 font-medium text-gray-900">{cs.subjectName}</td>
											<td class="px-6 py-4">
												{#if cs.teacherName}
													<span
														class="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700"
													>
														{cs.teacherName}
													</span>
												{:else}
													<span class="text-gray-400 italic">Belum ditugaskan</span>
												{/if}
											</td>
											<td class="px-6 py-4 text-right">
												<div class="flex justify-end gap-2">
													<button
														on:click={() => handleEditAssignClick(cs)}
														class="rounded p-1.5 text-blue-600 transition-all duration-200 hover:scale-110 hover:bg-blue-50 active:scale-95"
														title="Ubah Guru"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="h-5 w-5"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
															/>
														</svg>
													</button>
													<button
														on:click={() => handleDeleteAssign(cs)}
														class="rounded p-1.5 text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 active:scale-95"
														title="Hapus"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="h-5 w-5"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															/>
														</svg>
													</button>
												</div>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<div
							class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3"
						>
							<div class="text-sm text-gray-500">
								Total <span class="font-medium">{classSubjects.length}</span> mata pelajaran
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- ==================== SUBJECT MODAL ==================== -->
{#if showModal}
	<div
		class="fixed inset-0 z-2 flex items-center justify-center backdrop-blur-sm bg-black/20 p-4"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		role="dialog"
		tabindex="-1"
		aria-modal="true"
	>
		<div
			class="w-full max-w-md rounded-lg bg-white border border-slate-400 shadow-sm"
			transition:fly={{ y: 20, duration: 200 }}
		>
			<div class="flex items-center justify-between border-b border-slate-400 px-6 py-4">
				<h2 class="text-lg font-semibold text-gray-900">
					{isEditing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
				</h2>
				<button
					aria-label="close"
					on:click={handleCloseModal}
					class="text-gray-400 hover:text-gray-600"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="p-6">
				{#if error}
					<div class="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
				{/if}

				<div class="space-y-4">
					<div>
						<label for="subjectName" class="mb-1 block text-sm font-medium text-gray-700">
							Nama Mata Pelajaran <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="subjectName"
							bind:value={currentSubject.name}
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							placeholder="masukkan mata pelajaran"
							required
						/>
					</div>

					<div>
						<label for="subjectCode" class="mb-1 block text-sm font-medium text-gray-700">
							Kode Mata Pelajaran
						</label>
						<input
							type="text"
							id="subjectCode"
							bind:value={currentSubject.subjectCode}
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							placeholder="masukkan kode mapel"
						/>
					</div>

					<div>
						<label for="kkm" class="mb-1 block text-sm font-medium text-gray-700">KKM</label>
						<input
							type="number"
							id="kkm"
							bind:value={currentSubject.kkm}
							min="0"
							max="100"
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							placeholder="masukkan KKM"
						/>
					</div>

					<div>
						<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
							Deskripsi
						</label>
						<textarea
							id="description"
							bind:value={currentSubject.description}
							rows="3"
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
							placeholder="Deskripsi mata pelajaran..."
						></textarea>
					</div>
				</div>

				<div class="mt-6 flex justify-end gap-3">
					<button
						type="button"
						on:click={handleCloseModal}
						class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{isSubmitting ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- ==================== ASSIGNMENT MODAL ==================== -->
{#if showAssignModal}
	<div
		class="fixed inset-0 z-20 backdrop-blur-sm flex items-center justify-center bg-black/20 p-4"
		transition:fade={{ duration: 150 }}
		on:click={handleAssignBackdropClick}
		on:keydown={handleKeydown}
		role="dialog"
		tabindex="-1"
		aria-modal="true"
	>
		<div
			class="w-full max-w-md rounded-lg bg-white shadow-lg"
			transition:fly={{ y: 20, duration: 200 }}
		>
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="text-lg font-semibold text-gray-900">
					{isEditingAssign ? 'Ubah Guru Pengampu' : 'Tambah Mapel ke Kelas'}
				</h2>
				<button
					aria-label="close"
					on:click={handleCloseAssignModal}
					class="text-gray-400 hover:text-gray-600"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<form on:submit|preventDefault={handleAssignSubmit} class="p-6">
				{#if error}
					<div class="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
				{/if}

				<div class="space-y-4">
					<!-- Class (read-only when adding) -->
					<div>
						<label for="assignClass" class="mb-1 block text-sm font-medium text-gray-700">
							Kelas
						</label>
						<input
							type="text"
							id="assignClass"
							value={classesDropdown.find((c) => c.id === currentAssignment.classId)?.name || ''}
							class="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
							readonly
						/>
					</div>

					<!-- Subject (only when adding) -->
					{#if !isEditingAssign}
						<div>
							<label for="assignSubject" class="mb-1 block text-sm font-medium text-gray-700">
								Mata Pelajaran <span class="text-red-500">*</span>
							</label>
							<select
								id="assignSubject"
								bind:value={currentAssignment.subjectId}
								class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
								required
							>
								<option value={0}>-- Pilih Mata Pelajaran --</option>
								{#each unassignedSubjects as subj (subj.id)}
									<option value={subj.id}>{subj.name} {subj.code ? `(${subj.code})` : ''}</option>
								{/each}
							</select>
							{#if unassignedSubjects.length === 0}
								<p class="mt-1 text-xs text-gray-500">
									Semua mata pelajaran sudah ditugaskan ke kelas ini
								</p>
							{/if}
						</div>
					{:else}
						<div>
							<label for="assignSubjectRO" class="mb-1 block text-sm font-medium text-gray-700">
								Mata Pelajaran
							</label>
							<input
								type="text"
								id="assignSubjectRO"
								value={subjectsDropdown.find((s) => s.id === currentAssignment.subjectId)?.name ||
									''}
								class="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
								readonly
							/>
						</div>
					{/if}

					<!-- Teacher -->
					<div>
						<label for="assignTeacher" class="mb-1 block text-sm font-medium text-gray-700">
							Guru Pengampu
						</label>
						<select
							id="assignTeacher"
							bind:value={currentAssignment.teacherId}
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
						>
							<option value={null}>-- Belum Ditugaskan --</option>
							{#each teachersDropdown as teacher (teacher.id)}
								<option value={teacher.id}>{teacher.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="mt-6 flex justify-end gap-3">
					<button
						type="button"
						on:click={handleCloseAssignModal}
						class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting || (!isEditingAssign && currentAssignment.subjectId === 0)}
						class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{isSubmitting ? 'Menyimpan...' : isEditingAssign ? 'Perbarui' : 'Simpan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
