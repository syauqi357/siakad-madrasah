<script lang="ts">
	import { goto } from '$app/navigation';
	import AddIcon from '$lib/components/icons/addIcon.svelte';

	function addrombel() {
		goto('rombel/addrombel');
	}

	// Added 'id' to each item to simulate API data
	let rombelData = [
		{
			id: 1,
			namaRombel: 'IX A',
			tingkat: 9,
			waliKelas: 'linus torvalds',
			ruangan: 'Kelas IX A',
			kurikulum: '2013',
			totalSiswa: 17,
			kapasitas: 90
		},
		{
			id: 2,
			namaRombel: 'IX B',
			tingkat: 9,
			waliKelas: 'ada lovelace',
			ruangan: 'Kelas IX B',
			kurikulum: 'Merdeka',
			totalSiswa: 20,
			kapasitas: 32
		},
		{
			id: 3,
			namaRombel: 'X IPA 1',
			tingkat: 10,
			waliKelas: 'alan turing',
			ruangan: 'Lab Komputer',
			kurikulum: 'Merdeka',
			totalSiswa: 30,
			kapasitas: 30
		},
		{
			id: 4,
			namaRombel: 'XI GAMINK 1',
			tingkat: 8,
			waliKelas: 'jason susanto',
			ruangan: 'Lab Komputer',
			kurikulum: 'Merdeka',
			totalSiswa: 30,
			kapasitas: 40
		},
		{
			id: 5,
			namaRombel: 'X IPA 2',
			tingkat: 10,
			waliKelas: 'jensen huang',
			ruangan: 'Lab Komputer',
			kurikulum: 'Merdeka',
			totalSiswa: 18,
			kapasitas: 20
		}
	];

	// Function now accepts an ID
	function detailrombel(id: number) {
		// Use backticks (`) and ${id} to insert the variable into the string
		goto(`rombel/detailrombel/${id}`);
	}
</script>

<div class="p-4">
	<div>
		<button
			on:click={addrombel}
			class="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 font-medium text-blue-50 capitalize"
		>
			<AddIcon /> add rombel
		</button>
	</div>
</div>
<div class="min-h-100 p-4">
	<span class="mb-4 block text-2xl font-bold capitalize">rombongan belajar</span>

	<!-- Grid Container -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5">
		{#each rombelData as rombel}
			<!-- Card Container -->
			<!--
				We use an arrow function: () => detailrombel(rombel.id)
				This prevents the function from running immediately when the page loads.
			-->
			<button
				type="button"
				on:click={() => detailrombel(rombel.id)}
				class="flex aspect-square w-full cursor-pointer flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 text-left  transition-all ease-in-out hover:bg-gray-100"
			>
				<!-- Top Section -->
				<div class="flex w-full items-start justify-between">
					<div>
						<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
							Nama Rombel
						</div>
						<div class="text-2xl font-bold text-gray-800">{rombel.namaRombel}</div>
					</div>
					<div class="text-right">
						<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Tingkat</div>
						<div class="text-xl font-bold text-gray-800">{rombel.tingkat}</div>
					</div>
				</div>

				<!-- Middle Section -->
				<div class="flex w-full flex-col gap-4">
					<div>
						<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
							Wali Kelas
						</div>
						<div class="font-bold break-all text-gray-900 uppercase">{rombel.waliKelas}</div>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<div>
							<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
								Ruangan
							</div>
							<div class="my-2 w-fit rounded-sm bg-blue-500 px-3 py-1 text-sm text-blue-50">
								{rombel.ruangan}
							</div>
						</div>
						<div>
							<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
								Kurikulum
							</div>
							<div class="my-2 w-fit rounded-sm bg-blue-500 px-3 py-1 text-sm text-blue-50">
								{rombel.kurikulum}
							</div>
						</div>
					</div>
				</div>

				<!-- Bottom Section -->
				<div class="w-full border-t border-gray-100 pt-3">
					<div class="flex items-end justify-between">
						<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
							Total Siswa
						</div>
						<div class="text-xl font-bold text-gray-800">
							{rombel.totalSiswa}
							<span class="text-sm font-normal text-gray-400">/ {rombel.kapasitas}</span>
						</div>
					</div>
					<!-- Simple progress bar -->
					<div class="mt-2 h-1.5 w-full rounded-full bg-gray-100">
						<div
							class="h-1.5 rounded-full bg-blue-600"
							style="width: {(rombel.totalSiswa / rombel.kapasitas) * 100}%"
						></div>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>
