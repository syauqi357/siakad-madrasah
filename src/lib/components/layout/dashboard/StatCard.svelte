<script lang="ts">
	export let title: string;
	export let value: string | number | null = null;
	export let loading: boolean = false;
	export let icon: string | null | undefined = null;
	export let iconBg: string;
	export let changeColor: string | null = null; // or string | undefined
	export let change: string | null = null;
	export let changeType: 'up' | 'down' | 'neutral' = 'neutral';
	export let subtext: string | null = null;
</script>

<div
	class="rounded-lg border border-slate-200 bg-white p-4 transition-all duration-200 hover:scale-[1.02] hover:border-slate-300 hover:shadow-sm"
>
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
					class="mt-1 text-xs {changeColor ?? ''}"
					class:text-green-600={!changeColor && changeType === 'up'}
					class:text-red-600={!changeColor && changeType === 'down'}
					class:text-slate-500={!changeColor && changeType === 'neutral'}
				>
					{change}
				</p>
			{/if}
		</div>
		{#if icon}
			<div class="flex-shrink-0 rounded-lg p-2 {iconBg ?? ''}">
				{@html icon}
			</div>
		{/if}
	</div>
	{#if subtext}
		<p class="mt-2 text-xs text-slate-500">{subtext}</p>
	{/if}
</div>
