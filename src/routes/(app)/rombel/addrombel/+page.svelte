<script lang="ts">
	import AddIcon from '$lib/components/icons/addIcon.svelte';
	import ArrowLeft from '$lib/components/icons/arrow_left.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api.ts';

	// Define Student Interface
	interface Student {
		id: number;
		name: string;
		nisn: string;
		absen?: number; // Optional if not in DB yet
	}

	let students: Student[] = [];
	let selectedStudents: number[] = [];
	let isLoading = true;

	// Form Data State
	let formData = {
		tahun_ajaran: '2025/2026 Genap',
		tingkat_kelas: '',
		nama_rombel: '',
		wali_kelas: '',
		nama_ruangan: '',
		kurikulum: '',
		jenis_rombel: ''
	};

	// Fetch students on mount
	onMount(async () => {
		try {
			// Updated URL to match backend route structure
			const response = await API_FETCH(`/routes/api/studentDataSet/lite`);
			if (response.ok) {
				students = await response.json();
			} else {
				console.error('Failed to fetch students');
				alert('Failed to load student list.');
			}
		} catch (error) {
			console.error('Error fetching students:', error);
		} finally {
			isLoading = false;
		}
	});

	// Function to toggle all checkboxes
	function toggleAll(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			selectedStudents = students.map((student) => student.id);
		} else {
			selectedStudents = [];
		}
	}

	function backtomain() {
		goto('/rombel');
	}

	async function handleSubmit() {
		// --- Frontend Validation ---
		if (!formData.nama_rombel || !formData.tingkat_kelas || !formData.wali_kelas) {
			alert('Mohon lengkapi data wajib: Nama Rombel, Tingkat Kelas, dan Wali Kelas.');
			return;
		}

		// Construct the payload
		const payload = [
			{
				...formData,
				siswa: selectedStudents
			}
		];

		try {
			// Updated URL to match backend route structure
			const response = await API_FETCH(`/routes/api/rombel`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
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

	// Reactive statement to update the "Select All" checkbox state
	$: allSelected = students.length > 0 && selectedStudents.length === students.length;
</script>

<div class="mx-8">
	<button
		on:click={backtomain}
		class="text-md mb-6 flex items-center justify-center gap-2 rounded-sm bg-blue-500 px-5 py-2 text-blue-50 capitalize"
	>
		<ArrowLeft /> back
	</button>
</div>

<div class="mb-20 grid min-h-screen w-full grid-cols-1 gap-3 px-1 md:grid-cols-2 md:px-7">
	<!-- Form Section -->
	<div class="h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<h2 class="mb-6 border-b pb-2 text-xl font-bold text-gray-800">Tambah Rombongan Belajar</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Tahun Ajaran -->
			<div class="relative">
				<input
					type="text"
					id="tahun_ajaran"
					bind:value={formData.tahun_ajaran}
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none"
					placeholder=" "
				/>
				<label
					for="tahun_ajaran"
					class="absolute top-2 left-1 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Tahun Ajaran
				</label>
			</div>

			<!-- Tingkat Kelas -->
			<div class="relative">
				<select
					id="tingkat_kelas"
					bind:value={formData.tingkat_kelas}
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none"
				>
					<option value="" disabled selected></option>
					<option value="10">Kelas 10</option>
					<option value="11">Kelas 11</option>
					<option value="12">Kelas 12</option>
				</select>
				<label
					for="tingkat_kelas"
					class="absolute top-2 left-1 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Tingkat Kelas
				</label>
			</div>

			<!-- Nama Rombel -->
			<div class="relative">
				<input
					type="text"
					id="nama_rombel"
					bind:value={formData.nama_rombel}
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none"
					placeholder=" "
				/>
				<label
					for="nama_rombel"
					class="absolute top-2 left-1 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 after:ml-0.5 after:text-red-500 after:content-['*']"
				>
					Nama Rombel
				</label>
			</div>

			<!-- Wali Kelas -->
			<div class="relative">
				<select
					id="wali_kelas"
					bind:value={formData.wali_kelas}
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none"
				>
					<option value="" disabled selected></option>
					<option value="12345">12345 - Linus Torvalds</option>
					<option value="67890">67890 - Ada Lovelace</option>
				</select>
				<label
					for="wali_kelas"
					class="absolute top-2 left-1 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Wali Kelas
				</label>
			</div>

			<!-- Nama Ruangan -->
			<div class="relative">
				<select
					id="nama_ruangan"
					bind:value={formData.nama_ruangan}
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none"
				>
					<option value="" disabled selected></option>
					<option value="R01">Ruang 01</option>
					<option value="R02">Ruang 02</option>
				</select>
				<label
					for="nama_ruangan"
					class="absolute top-2 left-1 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Nama Ruangan
				</label>
			</div>

			<!-- Kurikulum -->
			<div class="relative">
				<input
					type="text"
					id="kurikulum"
					bind:value={formData.kurikulum}
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none"
					placeholder=" "
				/>
				<label
					for="kurikulum"
					class="absolute top-2 left-1 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Kurikulum
				</label>
			</div>

			<!-- Jenis Rombel -->
			<div class="relative">
				<select
					id="jenis_rombel"
					bind:value={formData.jenis_rombel}
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none"
				>
					<option value="" disabled selected></option>
					<option value="kelas">Kelas Reguler</option>
					<option value="sks">SKS</option>
				</select>
				<label
					for="jenis_rombel"
					class="absolute top-2 left-1 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Jenis Rombel
				</label>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="mt-6 flex justify-end">
			<button
				on:click={handleSubmit}
				class="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
			>
				Simpan Rombel
			</button>
		</div>
	</div>

	<!-- Table Section -->
	<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead class="border-b border-gray-200 bg-gray-50 font-medium text-gray-600 uppercase">
					<tr>
						<th class="w-10 px-4 py-3 text-center">
							<input
								type="checkbox"
								class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								checked={allSelected}
								on:change={toggleAll}
							/>
						</th>
						<th class="w-16 px-4 py-3">NO</th>
						<th class="px-4 py-3">NAMA SISWA</th>
						<th class="px-4 py-3">NISN</th>
						<th class="px-4 py-3">NOMOR ABSEN</th>
						<th class="px-4 py-3 text-right">
							<button
								class="text-md inline-flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white capitalize transition-colors hover:bg-blue-700"
							>
								<AddIcon /> tambah siswa
							</button>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#if isLoading}
						<tr>
							<td colspan="6" class="px-4 py-12 text-center text-gray-500">
								Loading data siswa...
							</td>
						</tr>
					{:else if students.length === 0}
						<tr>
							<td colspan="6" class="px-4 py-12 text-center text-gray-500">
								Data siswa masih Kosong
							</td>
						</tr>
					{:else}
						{#each students as student, i}
							<tr class="transition-colors hover:bg-gray-50">
								<td class="px-4 py-3 text-center">
									<input
										type="checkbox"
										class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										value={student.id}
										bind:group={selectedStudents}
									/>
								</td>
								<td class="px-4 py-3 text-gray-500">{i + 1}</td>
								<td class="px-4 py-3 font-medium text-gray-900 capitalize">{student.name}</td>
								<td class="px-4 py-3 text-gray-500">{student.nisn}</td>
								<td class="px-4 py-3 text-gray-500">{student.absen || '-'}</td>
								<td class="px-4 py-3"></td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
