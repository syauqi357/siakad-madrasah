<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';

	interface Student {
		id: number;
		name: string;
		nisn: string;
		absen?: number;
	}
	interface ClassData {
		id: number;
		className: string;
	}
	interface Teacher {
		id: number;
		fullName: string;
	}

	let students: Student[] = [];
	let classes: ClassData[] = [];
	let teachers: Teacher[] = [];
	let selectedStudents: number[] = [];
	let isLoading = true;

	let formData = {
		tahun_ajaran: '2025/2026 Genap',
		tingkat_kelas: '',
		nama_rombel: '',
		wali_kelas: '',
		nama_ruangan: '',
		kurikulum: '',
		jenis_rombel: '',
		student_capacity: 30
	};

	onMount(async () => {
		try {
			const [studentRes, classRes, teacherRes] = await Promise.all([
				API_FETCH('/routes/api/studentDataSet/lite'),
				API_FETCH('/routes/api/class-data/classes'),
				API_FETCH('/routes/api/teachers/list')
			]);

			if (studentRes.ok) {
				const studentData = await studentRes.json();
				students = studentData.data || studentData;
			} else {
				console.error('Failed to fetch students:', studentRes.statusText);
			}

			if (classRes.ok) {
				const data = await classRes.json();
				classes = data.data || data;
			} else {
				console.error('Failed to fetch classes:', classRes.statusText);
			}

			if (teacherRes.ok) {
				const data = await teacherRes.json();
				teachers = data.data || data;
			} else {
				console.error('Failed to fetch teachers:', teacherRes.statusText);
			}
		} catch (error) {
			console.error('Error fetching initial data:', error);
			alert('Failed to load initial page data. Check console for details.');
		} finally {
			isLoading = false;
		}
	});

	function toggleAll(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			selectedStudents = students.slice(0, formData.student_capacity).map((s) => s.id);
		} else {
			selectedStudents = [];
		}
	}

	async function handleSubmit() {
		if (!formData.nama_rombel || !formData.tingkat_kelas || !formData.wali_kelas) {
			alert('Mohon lengkapi data wajib: Nama Rombel, Tingkat Kelas, dan Wali Kelas.');
			return;
		}

		if (selectedStudents.length > formData.student_capacity) {
			alert(
				`Jumlah siswa terpilih (${selectedStudents.length}) melebihi kapasitas rombel (${formData.student_capacity}).`
			);
			return;
		}

		const payload = [{ ...formData, siswa: selectedStudents }];

		try {
			const response = await API_FETCH('/routes/api/rombel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const result = await response.json();
			if (response.ok) {
				alert('Rombel created successfully!');
				goto('/rombel');
			} else {
				alert('Failed to create rombel: ' + result.message);
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('An error occurred while submitting the form.');
		}
	}

	$: allSelected = students.length > 0 && selectedStudents.length === students.length;
	$: isCapacityFull = selectedStudents.length >= formData.student_capacity;
</script>

<div class="min-h-screen px-4 py-8 md:px-8">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div class="mb-6 flex items-center justify-between">
			<div>
				<button
					on:click={() => goto('/rombel')}
					class="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Kembali
				</button>
				<h1 class="text-2xl font-bold text-slate-900">Tambah Rombel</h1>
				<p class="mt-0.5 text-sm text-slate-500">Buat rombongan belajar baru dan pilih siswa</p>
			</div>
			<div class="hidden items-center gap-2 sm:flex">
				<span class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
					{selectedStudents.length}/{formData.student_capacity} siswa
				</span>
			</div>
		</div>

		<!-- Bento Grid -->
		<div class="grid gap-4 lg:grid-cols-5">
			<!-- Form Section — 2 cols -->
			<div class="rounded-lg border border-slate-200 bg-white lg:col-span-2">
				<div class="border-b border-slate-200 px-5 py-3">
					<h2 class="text-sm font-semibold text-slate-900">Data Rombel</h2>
				</div>

				<div class="space-y-4 p-5">
					<div class="space-y-1.5">
						<label for="tahun_ajaran" class="text-sm font-medium text-slate-700">Tahun Ajaran</label>
						<input
							type="text"
							id="tahun_ajaran"
							bind:value={formData.tahun_ajaran}
							class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-1.5">
							<label for="nama_rombel" class="text-sm font-medium text-slate-700">
								Nama Rombel <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="nama_rombel"
								bind:value={formData.nama_rombel}
								placeholder="Contoh: VII-A"
								class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
							/>
						</div>

						<div class="space-y-1.5">
							<label for="tingkat_kelas" class="text-sm font-medium text-slate-700">
								Tingkat Kelas <span class="text-red-500">*</span>
							</label>
							<select
								id="tingkat_kelas"
								bind:value={formData.tingkat_kelas}
								class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
							>
								<option value="" disabled>Pilih Tingkat</option>
								{#each classes as cls}
									<option value={cls.id}>{cls.className}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="space-y-1.5">
						<label for="wali_kelas" class="text-sm font-medium text-slate-700">
							Wali Kelas <span class="text-red-500">*</span>
						</label>
						<select
							id="wali_kelas"
							bind:value={formData.wali_kelas}
							class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
						>
							<option value="" disabled>Pilih Wali Kelas</option>
							{#each teachers as teacher}
								<option value={teacher.id}>{teacher.fullName}</option>
							{/each}
						</select>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-1.5">
							<label for="nama_ruangan" class="text-sm font-medium text-slate-700">Ruangan</label>
							<select
								id="nama_ruangan"
								bind:value={formData.nama_ruangan}
								class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
							>
								<option value="" disabled>Pilih Ruangan</option>
								<option value="R01">Ruang 01</option>
								<option value="R02">Ruang 02</option>
							</select>
						</div>

						<div class="space-y-1.5">
							<label for="kurikulum" class="text-sm font-medium text-slate-700">Kurikulum</label>
							<input
								type="text"
								id="kurikulum"
								bind:value={formData.kurikulum}
								placeholder="K13 / Merdeka"
								class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
							/>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-1.5">
							<label for="jenis_rombel" class="text-sm font-medium text-slate-700">Jenis Rombel</label>
							<select
								id="jenis_rombel"
								bind:value={formData.jenis_rombel}
								class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
							>
								<option value="" disabled>Pilih Jenis</option>
								<option value="kelas">Kelas Reguler</option>
								<option value="sks">SKS</option>
							</select>
						</div>

						<div class="space-y-1.5">
							<label for="student_capacity" class="text-sm font-medium text-slate-700">Kapasitas</label>
							<input
								type="number"
								id="student_capacity"
								bind:value={formData.student_capacity}
								min="1"
								class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
							/>
						</div>
					</div>

					<button
						on:click={handleSubmit}
						class="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						Simpan Rombel
					</button>
				</div>
			</div>

			<!-- Table Section — 3 cols -->
			<div class="rounded-lg border border-slate-200 bg-white lg:col-span-3">
				<div class="flex items-center justify-between border-b border-slate-200 px-5 py-3">
					<h2 class="text-sm font-semibold text-slate-900">Pilih Siswa</h2>
					<span class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
						{selectedStudents.length} dipilih
					</span>
				</div>

				{#if isCapacityFull}
					<div class="border-b border-amber-200 bg-amber-50 px-5 py-2 text-xs font-medium text-amber-700">
						Kapasitas rombel penuh ({formData.student_capacity} siswa)
					</div>
				{/if}

				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead class="bg-slate-50">
							<tr class="border-b border-slate-200">
								<th class="w-10 px-4 py-2.5 text-center">
									<input
										type="checkbox"
										class="cursor-pointer rounded border-slate-300 accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
										checked={allSelected}
										on:change={toggleAll}
										disabled={students.length > formData.student_capacity &&
											selectedStudents.length < students.length}
									/>
								</th>
								<th class="w-12 px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-slate-600 uppercase">No</th>
								<th class="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-slate-600 uppercase">Nama Siswa</th>
								<th class="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-slate-600 uppercase">NISN</th>
								<th class="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-slate-600 uppercase">Absen</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#if isLoading}
								<tr>
									<td colspan="5" class="px-4 py-12 text-center text-sm text-slate-500">
										<div class="flex items-center justify-center gap-2">
											<div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"></div>
											Memuat data siswa...
										</div>
									</td>
								</tr>
							{:else if students.length === 0}
								<tr>
									<td colspan="5" class="px-4 py-12 text-center text-sm text-slate-500">
										Data siswa masih kosong
									</td>
								</tr>
							{:else}
								{#each students as student, i}
									<tr class="transition-colors hover:bg-slate-50">
										<td class="px-4 py-2.5 text-center">
											<input
												type="checkbox"
												class="cursor-pointer rounded border-slate-300 accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
												value={student.id}
												bind:group={selectedStudents}
												disabled={!selectedStudents.includes(student.id) && isCapacityFull}
											/>
										</td>
										<td class="px-4 py-2.5 text-slate-400">{i + 1}</td>
										<td class="px-4 py-2.5 font-medium text-slate-800 capitalize">{student.name}</td>
										<td class="px-4 py-2.5 font-mono text-slate-500">{student.nisn}</td>
										<td class="px-4 py-2.5 text-slate-500">{student.absen || '-'}</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
