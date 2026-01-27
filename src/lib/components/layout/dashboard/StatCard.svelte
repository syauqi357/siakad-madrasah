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

<div
	class="flex w-full flex-col justify-center gap-2 rounded-lg bg-gray-50 p-5 outline-1 outline-blue-400 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:outline-3 hover:outline-offset-2 md:w-full"
>
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
		<span class=" my-4 rounded-md border border-slate-400 bg-slate-200 px-2.5 py-2">
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
