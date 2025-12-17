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
		{ id: 'users', label: 'Users' },
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
	$: {
		if (!isLoading) {
			selectedFilter;
			selectedTimeRange;
			fetchLogs();
		}
	}
</script>

<!-- Container -->
<div class="w-full max-w-full mx-auto p-4">
	<!-- Header -->
	<div class="mb-6">
		<h1 class="text-2xl font-bold mb-2">Audit Log</h1>
		<p class="text-sm">Riwayat aktivitas sistem</p>
	</div>

	<!-- Filters Section -->
	<div class="mb-4 space-y-3">
		<!-- Category Filters -->
		<div class="flex flex-wrap gap-2">
			{#each filters as filter}
				<button
					on:click={() => (selectedFilter = filter.id)}
					class="px-3 py-1.5 text-sm border rounded transition-colors {selectedFilter === filter.id
						? 'border-black bg-black text-white'
						: 'border-gray-300 bg-white hover:border-gray-400'}"
				>
					{filter.label}
				</button>
			{/each}
		</div>

		<!-- Search and Time Range -->
		<div class="flex flex-col sm:flex-row gap-3">
			<!-- Search -->
			<div class="flex-1">
				<input
					bind:value={searchQuery}
					type="text"
					placeholder="Cari log aktivitas..."
					class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
				/>
			</div>

			<!-- Time Range -->
			<select
				bind:value={selectedTimeRange}
				class="px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-gray-500"
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
	<div class="overflow-x-auto border border-gray-300 rounded">
		<table class="w-full text-sm text-left">
			<thead class="border-b border-gray-300 bg-gray-50">
				<tr>
					<th class="px-4 py-3 font-semibold w-[15%]">User</th>
					<th class="px-4 py-3 font-semibold w-[30%]">Action</th>
					<th class="px-4 py-3 font-semibold w-[20%]">Target</th>
					<th class="px-4 py-3 font-semibold w-[10%]">Status</th>
					<th class="px-4 py-3 font-semibold w-[25%]">Timestamp</th>
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
						<tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
							<td class="px-4 py-3 font-medium truncate">{log.user_id}</td>
							<td class="px-4 py-3 truncate">{log.action}</td>
							<td class="px-4 py-3 truncate">{log.target || '-'}</td>
							<td class="px-4 py-3">
								<span class="inline-block px-2 py-1 text-xs border border-gray-300 rounded">
									{log.status}
								</span>
							</td>
							<td class="px-4 py-3 truncate">
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