<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { navigationCategories } from '$lib/data/navigationCategories';

	function navigateTo(href: string) {
		goto(href);
	}

	const colorClasses: Record<string, { icon: string; dot: string; hover: string }> = {
		green: { icon: 'text-green-600', dot: 'bg-green-500', hover: 'hover:bg-green-50' },
		purple: { icon: 'text-purple-600', dot: 'bg-purple-500', hover: 'hover:bg-purple-50' },
		blue: { icon: 'text-blue-600', dot: 'bg-blue-500', hover: 'hover:bg-blue-50' }
	};
</script>

<div class="space-y-6">
	<h2 class="text-lg font-bold text-slate-900">Akses Cepat</h2>

	{#each navigationCategories as category, ci}
		{@const colors = colorClasses[category.color] || colorClasses.blue}
		<div in:fade={{ duration: 200, delay: 100 * ci }}>
			<div class="mb-3 flex items-center gap-2">
				<span class="h-2 w-2 rounded-full {colors.dot}"></span>
				<p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">
					{category.name}
				</p>
			</div>

			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
				{#each category.items as item, i}
					<div in:fly={{ y: 12, duration: 250, delay: 100 * ci + 50 * i, easing: quintOut }}>
						<button
							on:click={() => navigateTo(item.href)}
							class="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5 text-left transition-colors {colors.hover}"
						>
							<div class="{colors.icon} shrink-0">
								{@html item.icon}
							</div>
							<div class="min-w-0 flex-1">
								<p class="text-sm font-medium text-slate-800">{item.name}</p>
								<p class="text-xs text-slate-400">{item.description}</p>
							</div>
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
