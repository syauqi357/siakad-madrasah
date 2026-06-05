<script lang="ts">
	import type { AuditLog } from '$lib/services/auditService';
	import { createEventDispatcher } from 'svelte';

	export let logs: AuditLog[] = [];
	export let isLoading = false;
	export let error: string | null = null;

	// Sorting state
	export let sortField: keyof AuditLog = 'timestamp';
	export let sortDirection: 'asc' | 'desc' = 'desc';

	const dispatch = createEventDispatcher();

	function handleSort(field: keyof AuditLog) {
		dispatch('sort', field);
	}

	function handleRefresh() {
		dispatch('refresh');
	}

	// Helper function for status colors
	function getStatusColor(status: string): string {
		const statusControl = status.toLowerCase();
		if (statusControl.includes('created')) return 'bg-blue-50 text-blue-700 border-blue-200';
		if (statusControl.includes('success') || statusControl.includes('completed'))
			return 'bg-green-50 text-green-700 border-green-200';
		if (statusControl.includes('changed') || statusControl.includes('updated'))
			return 'bg-amber-50 text-amber-700 border-amber-200';
		if (
			statusControl.includes('deleted') ||
			statusControl.includes('failed') ||
			statusControl.includes('error')
		)
			return 'bg-red-50 text-red-700 border-red-200';
		if (statusControl.includes('viewed')) return 'bg-slate-50 text-slate-600 border-slate-200';
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

<div class="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead>
				<tr class="border-b border-slate-100 bg-white">
					{#each ['user_id', 'action', 'target'] as field}
						<th
							class="px-6 py-4 text-xs font-semibold tracking-wider whitespace-nowrap text-slate-400 uppercase"
						>
							<button
								on:click={() => handleSort(field as keyof AuditLog)}
								class="flex items-center gap-1.5 transition-colors hover:text-slate-600"
							>
								{field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)}
								<span class={sortField === field ? 'text-slate-700' : 'text-slate-300'}>
									{sortField === field ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
								</span>
							</button>
						</th>
					{/each}
					<th
						class="px-6 py-4 text-xs font-semibold tracking-wider whitespace-nowrap text-slate-400 uppercase"
					>
						Tipe
					</th>
					<th
						class="px-6 py-4 text-xs font-semibold tracking-wider whitespace-nowrap text-slate-400 uppercase"
					>
						<button
							on:click={() => handleSort('status')}
							class="flex items-center gap-1.5 transition-colors hover:text-slate-600"
						>
							Status
							<span class={sortField === 'status' ? 'text-slate-700' : 'text-slate-300'}>
								{sortField === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
							</span>
						</button>
					</th>
					<th
						class="px-6 py-4 text-xs font-semibold tracking-wider whitespace-nowrap text-slate-400 uppercase"
					>
						<button
							on:click={() => handleSort('timestamp')}
							class="flex items-center gap-1.5 transition-colors hover:text-slate-600"
						>
							Waktu
							<span class={sortField === 'timestamp' ? 'text-slate-700' : 'text-slate-300'}>
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
								<div
									class="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600"
								></div>
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
									on:click={handleRefresh}
									class="mt-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-50"
								>
									Coba lagi
								</button>
							</div>
						</td>
					</tr>
				{:else if logs.length === 0}
					<tr>
						<td colspan="6" class="px-6 py-16 text-center">
							<span class="text-sm text-slate-400">Tidak ada log yang ditemukan</span>
						</td>
					</tr>
				{:else}
					{#each logs as log (log.id)}
						<tr class="transition-colors hover:bg-slate-50">
							<td class="px-6 py-4 font-medium whitespace-nowrap text-slate-800">{log.user_id}</td>
							<td class="max-w-xs truncate px-6 py-4 text-slate-700">{log.action}</td>
							<td class="max-w-50 truncate px-6 py-4 text-slate-600">{log.target || '-'}</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-block rounded-md px-2 py-0.5 text-xs font-medium {getTypeBadge(
										log.audit_type
									)}"
								>
									{log.audit_type}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-block rounded-md border px-2 py-0.5 text-xs font-medium capitalize {getStatusColor(
										log.status
									)}"
								>
									{log.status}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-slate-500">
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
	{#if !isLoading && !error && logs.length > 0}
		<div class="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3">
			<span class="text-xs text-slate-400">
				Menampilkan {logs.length} log
			</span>
			<button
				on:click={handleRefresh}
				class="rounded-md px-2.5 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
			>
				Refresh
			</button>
		</div>
	{/if}
</div>
