<script lang="ts">
	// Mock data based on inputMapel.svelte fields
	let subjects = [
		{
			id: 1,
			name: 'Matematika',
			code: 'MTK-101',
			description: 'Aljabar, Geometri, dan Kalkulus dasar',
			teacher: 'John Doe',
			kkm: 75
		},
		{
			id: 2,
			name: 'Bahasa Indonesia',
			code: 'IND-101',
			description: 'Tata bahasa dan sastra Indonesia',
			teacher: 'Jane Smith',
			kkm: 78
		},
		{
			id: 3,
			name: 'Ilmu Pengetahuan Alam',
			code: 'IPA-101',
			description: 'Fisika, Kimia, dan Biologi dasar',
			teacher: 'Mike Jones',
			kkm: 70
		},
		{
			id: 4,
			name: 'Bahasa Inggris',
			code: 'ING-101',
			description: 'Grammar, Reading, and Speaking',
			teacher: 'Sarah Connor',
			kkm: 75
		},
		{
			id: 5,
			name: 'Sejarah',
			code: 'SEJ-101',
			description: 'Sejarah Nasional dan Dunia',
			teacher: 'Kyle Reese',
			kkm: 72
		}
	];
</script>

<div class="w-full overflow-hidden rounded-xl border border-gray-300 bg-white ">
	<header class="border-b border-gray-200 bg-gray-50 px-6 py-4">
		<h2 class="text-lg font-semibold text-gray-900">Daftar Mata Pelajaran</h2>
	</header>

	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm text-gray-600">
			<thead class="bg-gray-50 text-xs uppercase text-gray-700">
				<tr>
					<th scope="col" class="px-6 py-3 font-medium">No</th>
					<th scope="col" class="px-6 py-3 font-medium">Kode</th>
					<th scope="col" class="px-6 py-3 font-medium">Mata Pelajaran</th>
					<th scope="col" class="px-6 py-3 font-medium">Guru Pengampu</th>
					<th scope="col" class="px-6 py-3 font-medium">KKM</th>
					<th scope="col" class="px-6 py-3 font-medium">Deskripsi</th>
					<th scope="col" class="px-6 py-3 font-medium text-right">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each subjects as subject, index}
					<tr class="hover:bg-gray-50 transition-colors duration-150">
						<td class="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
						<td class="px-6 py-4">
							<span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
								{subject.code}
							</span>
						</td>
						<td class="px-6 py-4 font-medium text-gray-900">{subject.name}</td>
						<td class="px-6 py-4">
							<div class="flex items-center gap-2">
								<div class="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
									{subject.teacher.charAt(0)}
								</div>
								{subject.teacher}
							</div>
						</td>
						<td class="px-6 py-4 font-semibold text-gray-900">{subject.kkm}</td>
						<td class="px-6 py-4 max-w-xs truncate" title={subject.description}>{subject.description}</td>
						<td class="px-6 py-4 text-right">
							<div class="flex justify-end gap-2">
								<button class="rounded p-1 text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
									</svg>
								</button>
								<button class="rounded p-1 text-red-600 hover:bg-red-50 transition-colors" title="Hapus">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
									</svg>
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination (Mockup) -->
	<div class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
		<div class="text-sm text-gray-500">
			Menampilkan <span class="font-medium">1</span> sampai <span class="font-medium">5</span> dari <span class="font-medium">5</span> hasil
		</div>
		<div class="flex gap-2">
			<button class="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>Sebelumnya</button>
			<button class="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>Selanjutnya</button>
		</div>
	</div>
</div>
