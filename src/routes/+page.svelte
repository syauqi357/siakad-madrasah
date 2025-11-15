<script>
	import { activeMenu } from '$lib/stores.js';
	import { onMount } from 'svelte';

	$activeMenu = 'dashboard';

	// Example data structure. In a real app, you would fetch this from your Express.js backend.
	let cardData = [
		{
			title: 'Total Students',
			value: '1,234',
			change: '+12%',
			changeColor: 'text-green-600',
			icon: 'school',
			iconBg: 'bg-blue-100'
		},
		{
			title: 'Total Teachers',
			value: '89',
			change: '+5%',
			changeColor: 'text-green-600',
			icon: '👩‍🏫',
			iconBg: 'bg-purple-100'
		},
		{
			title: 'Total Classes',
			value: '32',
			subtext: '24 Active',
			icon: '🏫',
			iconBg: 'bg-green-100'
		},
		{
			title: 'Attendance Rate',
			value: '92.5%',
			change: '92%',
			changeColor: 'text-green-600',
			icon: '📈',
			iconBg: 'bg-orange-100'
		}
	];

	// onMount(async () => {
	//   const response = await fetch('http://your-express-api-url/dashboard-stats');
	//   cardData = await response.json();
	// });
</script>

<div class="bg mx-auto mt-12 max-w-7xl">
	<!-- header page -->
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
		<p class="mt-2 text-gray-600">Welcome to SchoolSys Education Platform</p>
	</div>

	<!-- statistics cards -->
	<div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
		{#each cardData as item}
			<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-4 flex items-center justify-between">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg {item.iconBg}">
						<span class="text-2xl">
							<!-- reclean up -->
								{item.icon}
							
						</span>
					</div>
					{#if item.change}
						<span class="text-sm font-medium {item.changeColor ?? 'text-gray-600'}">
							{item.change}
						</span>
					{:else if item.subtext}
						<span class="text-sm font-medium text-gray-600">{item.subtext}</span>
					{/if}
				</div>
				<h3 class="text-sm text-gray-600">{item.title}</h3>
				<p class="mt-2 text-3xl font-bold text-gray-900">{item.value}</p>
			</div>
		{/each}
	</div>
</div>
