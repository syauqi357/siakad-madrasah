<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
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
	let isExporting = false;

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

	async function exportLogs() {
		isExporting = true;
		try {
			const parts: string[] = [];
			if (selectedType !== 'all') parts.push(`type=${encodeURIComponent(selectedType)}`);
			if (selectedStatus !== 'all') parts.push(`status=${encodeURIComponent(selectedStatus)}`);
			if (selectedTimeRange !== 'all') parts.push(`timeRange=${encodeURIComponent(selectedTimeRange)}`);
			if (searchQuery.trim()) parts.push(`search=${encodeURIComponent(searchQuery.trim())}`);

			const response = await API_FETCH(`/routes/api/audit-logs/export?${parts.join('&')}`);
			const blob = await response.blob();
			const objectUrl = URL.createObjectURL(blob);
			const downloadLink = document.createElement('a');
			downloadLink.href = objectUrl;
			const today = new Date();
			const pad = (n: number) => String(n).padStart(2, '0');
			downloadLink.download = `audit-log-${pad(today.getDate())}-${pad(today.getMonth() + 1)}-${today.getFullYear()}.txt`;
			downloadLink.click();
			URL.revokeObjectURL(objectUrl);
		} finally {
			isExporting = false;
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
		<div class="flex items-center gap-3">
			<span class="text-sm text-slate-500">
				<span class="font-semibold text-slate-700">{sortedLogs.length}</span> log ditemukan
			</span>
			<button
				on:click={exportLogs}
				disabled={isExporting || sortedLogs.length === 0}
				class="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{#if isExporting}
					<div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
					Mengekspor...
				{:else}
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
					Export .txt
				{/if}
			</button>
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
