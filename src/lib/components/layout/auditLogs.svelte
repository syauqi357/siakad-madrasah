<script lang="ts">
	import { onMount } from 'svelte';

	let searchQuery: string = '';
	let selectedFilter: string = 'all';
	let selectedTimeRange: string = 'all';

	let auditLogs: AuditLog[] = [];
	let isLoading: boolean = true;
	let error: string | null = null;

	// Types
	type Filter = { id: string; label: string };

	interface TimeRange {
		id: string;
		label: string;
	}

	interface AuditLog {
		id: number;
		audit_type: string;
		user_id: string;
		action: string;
		target: string;
		status: string;
		timestamp: string;
	}

	// Filter options
	const filters: Filter[] = [
		{ id: 'all', label: 'Semua' },
		{ id: 'user_id', label: 'Users' },
		{ id: 'grades', label: 'Nilai' },
		{ id: 'students', label: 'Siswa' },
		{ id: 'attendance', label: 'Absensi' },
		{ id: 'teachers', label: 'Guru' },
		{ id: 'system', label: 'System' }
	];

	const timeRanges: TimeRange[] = [
		{ id: 'all', label: 'Semua Waktu' },
		{ id: 'today', label: 'Hari Ini' },
		{ id: 'week', label: 'Minggu Ini' },
		{ id: 'month', label: 'Bulan Ini' },
		{ id: 'semester', label: 'Semester Ini' }
	];

	onMount(async () => {
		await fetchLogs();
	});

	async function fetchLogs() {
		const apiBaseUrl = import.meta.env.VITE_API_URL;
		isLoading = true;
		error = null;

		try {
			// Build query params
			const params = new URLSearchParams();
			if (selectedFilter !== 'all') params.append('type', selectedFilter);
			if (selectedTimeRange !== 'all') params.append('timeRange', selectedTimeRange);

			const response = await fetch(`${apiBaseUrl}/api/audit-logs?${params.toString()}`);

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

	// Filter logs based on search
	$: filteredLogs = auditLogs.filter((log: AuditLog) => {
		if (searchQuery === '') return true;

		const query = searchQuery.toLowerCase();
		return (
			log.user_id.toLowerCase().includes(query) ||
			log.action.toLowerCase().includes(query) ||
			log.target?.toLowerCase().includes(query) ||
			log.status.toLowerCase().includes(query)
		);
	});

	// Refetch when filters change
	function handleFilterChange() {
		fetchLogs();
	}

	// Helper function for status colors
	function getStatusColor(status: string): string {
		const s = status.toLowerCase();
		if (s.includes('created')) return 'bg-blue-100 text-blue-800 border-blue-200';
		if (s.includes('success') || s.includes('completed')) return 'bg-green-100 text-green-800 border-green-200';
		if (s.includes('changed') || s.includes('updated')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		if (s.includes('deleted') || s.includes('failed') || s.includes('error')) return 'bg-red-100 text-red-800 border-red-200';
		if (s.includes('viewed')) return 'bg-gray-100 text-gray-800 border-gray-200';

		return 'bg-gray-100 text-gray-800 border-gray-200'; // Default
	}
</script>

<!-- Container -->
<div class="mx-auto w-full max-w-full p-4">
	<!-- Header -->
	<div class="mb-6">
		<h1 class="mb-2 text-2xl font-bold">Audit Log</h1>
		<p class="text-sm">Riwayat aktivitas sistem</p>
	</div>

	<!-- Filters Section -->
	<div class="mb-4 space-y-3">
		<!-- Category Filters -->
		<div class="flex flex-wrap gap-2">
			{#each filters as filter}
				<button
					on:click={() => {
						selectedFilter = filter.id;
						handleFilterChange();
					}}
					class="rounded border px-3 py-1.5 text-sm transition-colors {selectedFilter === filter.id
						? 'border-black bg-black text-white'
						: 'border-gray-300 bg-white hover:border-gray-400'}"
				>
					{filter.label}
				</button>
			{/each}
		</div>

		<!-- Search and Time Range -->
		<div class="flex flex-col gap-3 sm:flex-row">
			<!-- Search -->
			<div class="flex-1">
				<input
					bind:value={searchQuery}
					type="text"
					placeholder="Cari log aktivitas..."
					class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
				/>
			</div>

			<!-- Time Range -->
			<select
				bind:value={selectedTimeRange}
				on:change={handleFilterChange}
				class="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
			>
				{#each timeRanges as range}
					<option value={range.id}>{range.label}</option>
				{/each}
			</select>
		</div>

		<!-- Results Count -->
		<div class="text-sm">
			Menampilkan <span class="font-semibold">{filteredLogs.length}</span> dari
			<span class="font-semibold">{auditLogs.length}</span> log
		</div>
	</div>

	<!-- Table -->
	<div class="overflow-x-auto rounded border border-gray-300">
		<table class="w-full text-left text-sm">
			<thead class="border-b border-gray-300 bg-gray-50">
				<tr>
					<th class="w-[15%] px-4 py-3 font-semibold">User</th>
					<th class="w-[30%] px-4 py-3 font-semibold">Action</th>
					<th class="w-[20%] px-4 py-3 font-semibold">Target</th>
					<th class="w-[10%] px-4 py-3 font-semibold">Status</th>
					<th class="w-[25%] px-4 py-3 font-semibold">Timestamp</th>
				</tr>
			</thead>
			<tbody>
				{#if isLoading}
					<tr>
						<td colspan="5" class="px-4 py-12 text-center text-gray-500">Memuat log...</td>
					</tr>
				{:else if error}
					<tr>
						<td colspan="5" class="px-4 py-12 text-center text-red-600">{error}</td>
					</tr>
				{:else if filteredLogs.length === 0}
					<tr>
						<td colspan="5" class="px-4 py-12 text-center text-gray-500">
							Tidak ada log yang ditemukan
						</td>
					</tr>
				{:else}
					{#each filteredLogs as log (log.id)}
						<tr class="border-b border-gray-200 transition-colors hover:bg-gray-50">
							<td class="truncate px-4 py-3 font-medium">{log.user_id}</td>
							<td class="truncate px-4 py-3">{log.action}</td>
							<td class="truncate px-4 py-3">{log.target || '-'}</td>
							<td class="px-4 py-3">
								<span class="inline-block rounded border px-2 py-1 text-xs capitalize {getStatusColor(log.status)}">
									{log.status}
								</span>
							</td>
							<td class="truncate px-4 py-3">
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
</div>
