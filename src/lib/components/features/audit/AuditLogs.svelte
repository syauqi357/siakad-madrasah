<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchAuditLogs, type AuditLog } from '$lib/services/auditService';
	import AuditFilters from './AuditFilters.svelte';
	import AuditTable from './AuditTable.svelte';

	let searchQuery = '';
	let selectedType = 'all';
	let selectedStatus = 'all';
	let selectedTimeRange = 'all';

	let auditLogs: AuditLog[] = [];
	let isLoading = true;
	let error: string | null = null;

	let sortField: keyof AuditLog = 'timestamp';
	let sortDirection: 'asc' | 'desc' = 'desc';

	onMount(async () => {
		await loadLogs();
	});

	async function loadLogs() {
		isLoading = true;
		error = null;
		try {
			auditLogs = await fetchAuditLogs({
				type: selectedType,
				status: selectedStatus,
				timeRange: selectedTimeRange,
				search: searchQuery
			});
		} catch (error_type: any) {
			error = error_type.message || 'Tidak dapat memuat log audit.';
		} finally {
			isLoading = false;
		}
	}

	function handleSort(event: CustomEvent<keyof AuditLog>) {
		const field = event.detail;
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'asc';
		}
	}

	$: sortedLogs = [...auditLogs].sort((currentLog, compareLog) => {
		let currentValue: string | number = currentLog[sortField] || '';
		let compareValue: string | number = compareLog[sortField] || '';

		if (sortField === 'timestamp') {
			currentValue = new Date(currentValue).getTime();
			compareValue = new Date(compareValue).getTime();
		} else {
			currentValue = String(currentValue).toLowerCase();
			compareValue = String(compareValue).toLowerCase();
		}

		if (currentValue < compareValue) return sortDirection === 'asc' ? -1 : 1;
		if (currentValue > compareValue) return sortDirection === 'asc' ? 1 : -1;
		return 0;
	});
</script>

<div class="mx-auto w-full max-w-full space-y-6 p-6">
	<div
		class="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center"
	>
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Audit Log</h1>
			<p class="mt-1 text-sm text-slate-500">Riwayat aktivitas sistem</p>
		</div>
		<div class="text-sm text-slate-500">
			<span class="font-semibold text-slate-700">{sortedLogs.length}</span> log ditemukan
		</div>
	</div>

	<AuditFilters
		bind:searchQuery
		bind:selectedType
		bind:selectedStatus
		bind:selectedTimeRange
		on:change={loadLogs}
	/>

	<AuditTable
		logs={sortedLogs}
		{isLoading}
		{error}
		{sortField}
		{sortDirection}
		on:sort={handleSort}
		on:refresh={loadLogs}
	/>
</div>
