<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let searchQuery = '';
	export let selectedType = 'all';
	export let selectedStatus = 'all';
	export let selectedTimeRange = 'all';

	const dispatch = createEventDispatcher();

	type FilterOption = { id: string; label: string };

	const typeFilters: FilterOption[] = [
		{ id: 'all', label: 'Semua' },
		{ id: 'users', label: 'Users' },
		{ id: 'students', label: 'Siswa' },
		{ id: 'teachers', label: 'Guru' },
		{ id: 'school', label: 'Sekolah' },
		{ id: 'system', label: 'System' }
	];

	const statusFilters: FilterOption[] = [
		{ id: 'all', label: 'Semua' },
		{ id: 'created', label: 'Created' },
		{ id: 'changed', label: 'Changed' },
		{ id: 'deleted', label: 'Deleted' },
		{ id: 'viewed', label: 'Viewed' },
		{ id: 'success', label: 'Success' }
	];

	const timeRanges: FilterOption[] = [
		{ id: 'all', label: 'Semua Waktu' },
		{ id: 'today', label: 'Hari Ini' },
		{ id: 'week', label: 'Minggu Ini' },
		{ id: 'month', label: 'Bulan Ini' },
		{ id: 'semester', label: 'Semester Ini' }
	];

	function handleChange() {
		dispatch('change');
	}

	let searchTimeout: ReturnType<typeof setTimeout>;
	function handleSearchInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => handleChange(), 400);
	}
</script>

<div class="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
	<!-- Row 1: Type filter chips -->
	<div>
		<span class="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase"
			>Tipe</span
		>
		<div class="flex flex-wrap gap-2">
			{#each typeFilters as filter (filter.id)}
				<button
					on:click={() => {
						selectedType = filter.id;
						handleChange();
					}}
					class="rounded-md border px-3 py-1.5 text-sm transition-all duration-200 {selectedType ===
					filter.id
						? 'border-slate-800 bg-slate-800 text-white'
						: 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'}"
				>
					{filter.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Row 2: Search + dropdowns -->
	<div class="flex flex-col gap-3 sm:flex-row">
		<div class="flex-1">
			<input
				bind:value={searchQuery}
				on:input={handleSearchInput}
				type="text"
				placeholder="Cari user, action, atau target..."
				class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-all duration-100 placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:shadow focus:outline-none"
			/>
		</div>

		<div class="relative">
			<select
				bind:value={selectedStatus}
				on:change={handleChange}
				class="w-full appearance-none rounded-md border border-slate-300 bg-white py-2 pr-8 pl-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-400 focus:border-blue-500 focus:shadow focus:outline-none sm:w-auto"
			>
				<option value="all" disabled selected hidden>Status</option>
				{#each statusFilters as statusFilterData (statusFilterData.id)}
					<option value={statusFilterData.id}>{statusFilterData.label}</option>
				{/each}
			</select>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
		</div>

		<div class="relative">
			<select
				bind:value={selectedTimeRange}
				on:change={handleChange}
				class="w-full appearance-none rounded-md border border-slate-300 bg-white py-2 pr-8 pl-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-400 focus:border-blue-500 focus:shadow focus:outline-none sm:w-auto"
			>
				{#each timeRanges as rangeofTimes (rangeofTimes.id)}
					<option value={rangeofTimes.id}>{rangeofTimes.label}</option>
				{/each}
			</select>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
		</div>
	</div>
</div>
