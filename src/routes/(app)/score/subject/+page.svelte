<script lang="ts">
	import InputMapel from '$lib/components/layout/inputMapel.svelte';
	import TableMapel from '$lib/components/layout/tableMapel.svelte';
	import AddIcon from '$lib/components/icons/AddIcon.svelte';
</script>

<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header Section -->
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-bold md:text-4xl sm:text-3xl text-blue-600">Manajemen Mata Pelajaran</h1>
			<p class="text-gray-600">Kelola data mata pelajaran, kode, dan guru pengampu di sini.</p>
		<button class="bg-blue-600 text-blue-50 flex gap-2 capitalize justify-center items-center px-5 py-3 rounded-md  w-fit">
			<AddIcon/> tambah mata pelajaran
		</button>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Input Form Section (1/3 width on large screens) -->
			<div class="lg:col-span-1">
				<div class="sticky top-24 hidden">
					<InputMapel />
				</div>
			</div>

			<!-- Table Section (2/3 width on large screens) -->
			<div class="lg:col-span-2">
				<TableMapel />
			</div>
		</div>
	</div>
</div>
