<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';

	let searchQuery: string = '';
	let selectedType: string = 'all';
	let selectedStatus: string = 'all';
	let selectedTimeRange: string = 'all';

	let auditLogs: AuditLog[] = [];
	let isLoading: boolean = true;
	let error: string | null = null;

	// Sorting state
	type SortField = 'user_id' | 'action' | 'target' | 'status' | 'timestamp';
	type SortDirection = 'asc' | 'desc';
	let sortField: SortField = 'timestamp';
	let sortDirection: SortDirection = 'desc';

	// Types
	type FilterOption = { id: string; label: string };

	interface AuditLog {
		id: number;
		audit_type: string;
		user_id: string;
		action: string;
		target: string;
		status: string;
		timestamp: string;
	}

	// Filter options matching backend audit_type values
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

	onMount(async () => {
		await fetchLogs();
	});

	let searchTimeout: ReturnType<typeof setTimeout>;

	async function fetchLogs() {
		isLoading = true;
		error = null;

		try {
			const params = new URLSearchParams();
			if (selectedType !== 'all') params.append('type', selectedType);
			if (selectedStatus !== 'all') params.append('status', selectedStatus);
			if (selectedTimeRange !== 'all') params.append('timeRange', selectedTimeRange);
			if (searchQuery.trim()) params.append('search', searchQuery.trim());

			const response = await API_FETCH(`/routes/api/audit-logs?${params.toString()}`);

			if (!response.ok) {
				throw new Error(`Gagal memuat data: ${response.statusText}`);
			}

			auditLogs = await response.json();
		} catch (e: any) {
			error = e.message || 'Tidak dapat memuat log audit.';
			console.error('Gagal mengambil log audit:', e);
		} finally {
			isLoading = false;
		}
	}

	function handleSearchInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => fetchLogs(), 400);
	}

	// Sort logs (filtering is now server-side)
	$: filteredLogs = [...auditLogs].sort((a, b) => {
		let aVal: string | number = a[sortField] || '';
		let bVal: string | number = b[sortField] || '';

		// Handle timestamp sorting
		if (sortField === 'timestamp') {
			aVal = new Date(aVal).getTime();
			bVal = new Date(bVal).getTime();
		} else {
			aVal = String(aVal).toLowerCase();
			bVal = String(bVal).toLowerCase();
		}

		if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
		if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
		return 0;
	});

	// Handle column sort
	function handleSort(field: SortField) {
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'asc';
		}
	}

	// Refetch when filters change
	function handleFilterChange() {
		fetchLogs();
	}

	// Helper function for status colors
	function getStatusColor(status: string): string {
		const s = status.toLowerCase();
		if (s.includes('created')) return 'bg-blue-50 text-blue-700 border-blue-200';
		if (s.includes('success') || s.includes('completed'))
			return 'bg-green-50 text-green-700 border-green-200';
		if (s.includes('changed') || s.includes('updated'))
			return 'bg-amber-50 text-amber-700 border-amber-200';
		if (s.includes('deleted') || s.includes('failed') || s.includes('error'))
			return 'bg-red-50 text-red-700 border-red-200';
		if (s.includes('viewed')) return 'bg-slate-50 text-slate-600 border-slate-200';
		return 'bg-slate-50 text-slate-600 border-slate-200';
	}

	// Helper for audit_type badge
	function getTypeBadge(type: string): string {
		switch (type) {
			case 'users':
				return 'bg-violet-50 text-violet-700';
			case 'students':
				return 'bg-blue-50 text-blue-700';
			case 'teachers':
				return 'bg-emerald-50 text-emerald-700';
			case 'school':
				return 'bg-amber-50 text-amber-700';
			default:
				return 'bg-slate-100 text-slate-600';
		}
	}
</script>

<div class="mx-auto w-full max-w-full space-y-6 p-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Audit Log</h1>
			<p class="mt-1 text-sm text-slate-500">Riwayat aktivitas sistem</p>
		</div>
		<div class="text-sm text-slate-500">
			<span class="font-semibold text-slate-700">{filteredLogs.length}</span> log ditemukan
		</div>
	</div>

	<!-- Filters Card -->
	<div class="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
		<!-- Row 1: Type filter chips -->
		<div>
			<span class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Tipe</span>
			<div class="flex flex-wrap gap-2">
				{#each typeFilters as filter}
					<button
						on:click={() => {
							selectedType = filter.id;
							handleFilterChange();
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
					on:change={handleFilterChange}
					class="w-full appearance-none rounded-md border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 transition-all duration-100 hover:border-slate-400 focus:border-blue-500 focus:shadow focus:outline-none sm:w-auto"
				>
					<option value="all" disabled selected hidden>Status</option>
					{#each statusFilters as s}
						<option value={s.id}>{s.label}</option>
					{/each}
				</select>
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</div>

			<div class="relative">
				<select
					bind:value={selectedTimeRange}
					on:change={handleFilterChange}
					class="w-full appearance-none rounded-md border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 transition-all duration-100 hover:border-slate-400 focus:border-blue-500 focus:shadow focus:outline-none sm:w-auto"
				>
					{#each timeRanges as range}
						<option value={range.id}>{range.label}</option>
					{/each}
				</select>
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</div>
		</div>
	</div>

	<!-- Table -->
	<div class="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-slate-100 bg-white">
						<th class="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
							<button
								on:click={() => handleSort('user_id')}
								class="flex items-center gap-1.5 transition-colors hover:text-slate-600"
							>
								User
								<span class="{sortField === 'user_id' ? 'text-slate-700' : 'text-slate-300'}">
									{sortField === 'user_id' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
								</span>
							</button>
						</th>
						<th class="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
							<button
								on:click={() => handleSort('action')}
								class="flex items-center gap-1.5 transition-colors hover:text-slate-600"
							>
								Action
								<span class="{sortField === 'action' ? 'text-slate-700' : 'text-slate-300'}">
									{sortField === 'action' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
								</span>
							</button>
						</th>
						<th class="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
							<button
								on:click={() => handleSort('target')}
								class="flex items-center gap-1.5 transition-colors hover:text-slate-600"
							>
								Target
								<span class="{sortField === 'target' ? 'text-slate-700' : 'text-slate-300'}">
									{sortField === 'target' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
								</span>
							</button>
						</th>
						<th class="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
							Tipe
						</th>
						<th class="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
							<button
								on:click={() => handleSort('status')}
								class="flex items-center gap-1.5 transition-colors hover:text-slate-600"
							>
								Status
								<span class="{sortField === 'status' ? 'text-slate-700' : 'text-slate-300'}">
									{sortField === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
								</span>
							</button>
						</th>
						<th class="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
							<button
								on:click={() => handleSort('timestamp')}
								class="flex items-center gap-1.5 transition-colors hover:text-slate-600"
							>
								Waktu
								<span class="{sortField === 'timestamp' ? 'text-slate-700' : 'text-slate-300'}">
									{sortField === 'timestamp' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
								</span>
							</button>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100">
					{#if isLoading}
						<tr>
							<td colspan="6" class="px-6 py-16 text-center">
								<div class="flex flex-col items-center gap-3">
									<div class="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600"></div>
									<span class="text-sm text-slate-400">Memuat log...</span>
								</div>
							</td>
						</tr>
					{:else if error}
						<tr>
							<td colspan="6" class="px-6 py-16 text-center">
								<div class="flex flex-col items-center gap-2">
									<span class="text-sm text-red-500">{error}</span>
									<button
										on:click={fetchLogs}
										class="mt-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-50"
									>
										Coba lagi
									</button>
								</div>
							</td>
						</tr>
					{:else if filteredLogs.length === 0}
						<tr>
							<td colspan="6" class="px-6 py-16 text-center">
								<span class="text-sm text-slate-400">Tidak ada log yang ditemukan</span>
							</td>
						</tr>
					{:else}
						{#each filteredLogs as log (log.id)}
							<tr class="transition-colors hover:bg-slate-50">
								<td class="whitespace-nowrap px-6 py-4 font-medium text-slate-800">{log.user_id}</td>
								<td class="max-w-xs truncate px-6 py-4 text-slate-700">{log.action}</td>
								<td class="max-w-[200px] truncate px-6 py-4 text-slate-600">{log.target || '-'}</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span class="inline-block rounded-md px-2 py-0.5 text-xs font-medium {getTypeBadge(log.audit_type)}">
										{log.audit_type}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span
										class="inline-block rounded-md border px-2 py-0.5 text-xs font-medium capitalize {getStatusColor(log.status)}"
									>
										{log.status}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-slate-500">
									{new Date(log.timestamp).toLocaleString('id-ID', {
										dateStyle: 'medium',
										timeStyle: 'short'
									})}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Footer -->
		{#if !isLoading && !error && filteredLogs.length > 0}
			<div class="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3">
				<span class="text-xs text-slate-400">
					Menampilkan {filteredLogs.length} log
				</span>
				<button
					on:click={fetchLogs}
					class="rounded-md px-2.5 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
				>
					Refresh
				</button>
			</div>
		{/if}
	</div>
</div>
