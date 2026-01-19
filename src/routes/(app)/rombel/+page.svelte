<script lang="ts">
	import { goto } from '$app/navigation';
	import AddIcon from '$lib/components/icons/addIcon.svelte';

	function addrombel() {
		goto('rombel/addrombel');
	}
</script>

<div class="bg-amber-300 p-4">
	<div>
		<button
			on:click={addrombel}
			class="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 font-medium text-blue-50 capitalize"
		>
			<AddIcon /> add rombel
		</button>
	</div>
</div>
<div class="min-h-100 bg-amber-400 p-4">
	<span class="mb-4 block text-lg font-bold">rombongan belajar</span>

	<!-- Card Container -->
	<div
		class="flex aspect-square w-72 flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
	>
		<!-- Top Section -->
		<div class="flex items-start justify-between">
			<div>
				<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Nama Rombel</div>
				<div class="text-2xl font-bold text-gray-800">IX A</div>
			</div>
			<div class="text-right">
				<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Tingkat</div>
				<div class="text-xl font-bold text-gray-800">9</div>
			</div>
		</div>

		<!-- Middle Section -->
		<div class="flex flex-col gap-4">
			<div>
				<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Wali Kelas</div>
				<div class="font-medium text-gray-900">MUHAMMAD KHOIRUL UMAM</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div>
					<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Ruangan</div>
					<div class="text-sm text-gray-700">Kelas IX A</div>
				</div>
				<div>
					<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Kurikulum</div>
					<div class="text-sm text-gray-700">2013</div>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="border-t border-gray-100 pt-3">
			<div class="flex items-end justify-between">
				<div class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Total Siswa</div>
				<div class="text-xl font-bold text-gray-800">
					17 <span class="text-sm font-normal text-gray-400">/ 35</span>
				</div>
			</div>
			<!-- Simple progress bar -->
			<div class="mt-2 h-1.5 w-full rounded-full bg-gray-100">
				<div class="h-1.5 rounded-full bg-blue-600" style="width: 48%"></div>
			</div>
		</div>
	</div>
</div>
