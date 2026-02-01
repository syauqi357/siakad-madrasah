<script lang="ts">
	export let title: string;
	export let value: string | number | null = null;
	export let loading: boolean = false;
	export let icon: string = '';
	export let change: string | null = null;
	export let changeType: 'up' | 'down' | 'neutral' = 'neutral';
</script>

<div class="rounded-lg border border-slate-200 bg-white p-4">
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 flex-1">
			<p class="truncate text-sm text-slate-500">{title}</p>
			{#if loading || value === null}
				<div class="mt-1 h-7 w-16 animate-pulse rounded bg-slate-200"></div>
			{:else}
				<p class="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
			{/if}
			{#if change}
				<p
					class="mt-1 text-xs"
					class:text-green-600={changeType === 'up'}
					class:text-red-600={changeType === 'down'}
					class:text-slate-500={changeType === 'neutral'}
				>
					{change}
				</p>
			{/if}
		</div>
		{#if icon}
			<div class="flex-shrink-0 text-slate-400">
				{@html icon}
			</div>
		{/if}
	</div>
</div>
