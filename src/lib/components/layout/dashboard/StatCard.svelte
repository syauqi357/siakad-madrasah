<script lang="ts">
	export let title: string;
	export let value: string | number | null = null;
	export let loading: boolean = false;
	export let icon: string; // SVG string
	export let iconBg: string = 'bg-blue-100';
	export let change: string | null = null;
	export let changeColor: string = 'text-green-600';
	export let subtext: string | null = null;
</script>

<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
	<div class="mb-4 flex items-center justify-between">
		<!-- Icon -->
		<div class="flex h-12 w-12 items-center justify-center rounded-lg {iconBg}">
			<span class="text-2xl duration-150 ease-in hover:scale-105 hover:rotate-4">
				{@html icon}
			</span>
		</div>

		<!-- Change / Subtext -->
		{#if change}
			<span class="text-sm font-medium {changeColor}">
				{change}
			</span>
		{:else if subtext}
			<span class="text-sm font-medium text-slate-600">
				{subtext}
			</span>
		{/if}
	</div>

	<!-- Title -->
	<h3 class="text-sm text-slate-500 duration-150 ease-in-out hover:rotate-3">
		<span class="mt-4 mb-4 rounded-md border border-slate-400 bg-slate-200 p-2 pr-2.5 pl-2.5">
			{title}
		</span>
	</h3>

	<!-- Value / Loading State -->
	{#if loading || value === null}
		<div class="mt-2 h-10 w-24 animate-pulse rounded bg-gray-200"></div>
	{:else}
		<p class="mt-2 text-4xl font-bold text-gray-900">{value}</p>
	{/if}
</div>
