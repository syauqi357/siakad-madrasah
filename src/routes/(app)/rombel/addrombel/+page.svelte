<script lang="ts">

import AddIcon from '$lib/components/icons/addIcon.svelte';

	// Mock data for demonstration
	let students = [
		{ id: 1, name: 'bill gates', nisn: '1123', absen: 1 },
		{ id: 2, name: 'steve jobs', nisn: '1124', absen: 2 },
		{ id: 3, name: 'linus torvalds', nisn: '1125', absen: 3 }
	];

	let selectedStudents = [];

	// Function to toggle all checkboxes
	function toggleAll(event) {
		if (event.target.checked) {
			selectedStudents = students.map((student) => student.id);
		} else {
			selectedStudents = [];
		}
	}

	// Reactive statement to update the "Select All" checkbox state
	$: allSelected = students.length > 0 && selectedStudents.length === students.length;
</script>

<div class=" w-full grid md:grid-cols-2 md:px-7 px-1 grid-cols-1 gap-3 min-h-screen">
	<!-- Form Section -->
	<div class="bg-white rounded-lg h-fit shadow-sm border border-gray-200 p-6">
		<h2 class="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Tambah Rombongan Belajar</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Tahun Ajaran -->
			<div class="relative">
				<input
					type="text"
					id="tahun_ajaran"
					value="2025/2026 Genap"
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
					placeholder=" "
				/>
				<label
					for="tahun_ajaran"
					class="absolute left-1 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Tahun Ajaran
				</label>
			</div>

			<!-- Tingkat Kelas -->
			<div class="relative">
				<select
					id="tingkat_kelas"
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
				>
					<option value="" disabled selected></option>
					<option value="10">Kelas 10</option>
					<option value="11">Kelas 11</option>
					<option value="12">Kelas 12</option>
				</select>
				<label
					for="tingkat_kelas"
					class="absolute left-1 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Tingkat Kelas
				</label>
			</div>

			<!-- Nama Rombel -->
			<div class="relative">
				<input
					type="text"
					id="nama_rombel"
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
					placeholder=" "
				/>
				<label
					for="nama_rombel"
					class="absolute left-1 top-2 z-10 origin-left -translate-y-4 scale-75 transform after:ml-0.5 after:text-red-500 after:content-['*'] bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Nama Rombel
				</label>
			</div>

			<!-- Wali Kelas -->
			<div class="relative">
				<select
					id="wali_kelas"
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
				>
					<option value="" disabled selected></option>
					<option value="12345">12345 - Linus Torvalds</option>
					<option value="67890">67890 - Ada Lovelace</option>
				</select>
				<label
					for="wali_kelas"
					class="absolute left-1 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Wali Kelas
				</label>
			</div>

			<!-- Nama Ruangan -->
			<div class="relative">
				<select
					id="nama_ruangan"
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
				>
					<option value="" disabled selected></option>
					<option value="R01">Ruang 01</option>
					<option value="R02">Ruang 02</option>
				</select>
				<label
					for="nama_ruangan"
					class="absolute left-1 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Nama Ruangan
				</label>
			</div>

			<!-- Kurikulum -->
			<div class="relative">
				<input
					type="text"
					id="kurikulum"
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
					placeholder=" "
				/>
				<label
					for="kurikulum"
					class="absolute left-1 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Kurikulum
				</label>
			</div>

			<!-- Jenis Rombel -->
			<div class="relative">
				<select
					id="jenis_rombel"
					class="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
				>
					<option value="" disabled selected></option>
					<option value="kelas">Kelas Reguler</option>
					<option value="sks">SKS</option>
				</select>
				<label
					for="jenis_rombel"
					class="absolute left-1 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-75 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
				>
					Jenis Rombel
				</label>
			</div>
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
								class="inline-flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 capitalize text-md font-medium text-white transition-colors hover:bg-blue-700"
							>
								<AddIcon/> tambah siswa
							</button>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#if students.length === 0}
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
								<td class="px-4 py-3 text-gray-500">{student.absen}</td>
								<td class="px-4 py-3"></td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
