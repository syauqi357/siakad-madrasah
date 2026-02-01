<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigationCategories } from '$lib/data/navigationCategories';

	function navigateTo(href: string) {
		goto(href);
	}

	// Color mapping
	const colorClasses: Record<
		string,
		{ bg: string; border: string; text: string; hover: string; iconBg: string }
	> = {
		green: {
			bg: 'bg-green-50',
			border: 'border-green-200',
			text: 'text-green-700',
			hover: 'hover:bg-green-100 hover:border-green-400 hover:shadow-md',
			iconBg: 'bg-green-100'
		},
		purple: {
			bg: 'bg-purple-50',
			border: 'border-purple-200',
			text: 'text-purple-700',
			hover: 'hover:bg-purple-100 hover:border-purple-400 hover:shadow-md',
			iconBg: 'bg-purple-100'
		},
		blue: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			text: 'text-blue-700',
			hover: 'hover:bg-blue-100 hover:border-blue-400 hover:shadow-md',
			iconBg: 'bg-blue-100'
		}
	};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-bold text-slate-800">Akses Cepat</h2>
	</div>

	{#each navigationCategories as category}
		{@const colors = colorClasses[category.color] || colorClasses.blue}
		<div>
			<!-- Category Label -->
			<p class="mb-3 text-xs font-semibold tracking-wider uppercase {colors.text}">
				{category.name}
			</p>

			<!-- Cards Grid -->
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{#each category.items as item}
					<button
						on:click={() => navigateTo(item.href)}
						class="group flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200 {colors.bg} {colors.border} {colors.hover}"
					>
						<!-- Icon -->
						<div
							class="rounded-xl p-3 {colors.iconBg} {colors.text} transition-transform group-hover:scale-110"
						>
							{@html item.icon}
						</div>

						<!-- Text -->
						<div>
							<p class="text-sm font-semibold text-slate-800">{item.name}</p>
							<p class="mt-0.5 text-xs text-slate-500">{item.description}</p>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>
