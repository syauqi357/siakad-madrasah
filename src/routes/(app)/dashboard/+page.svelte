<script lang="ts">
	import SchoolProperties from '$lib/components/layout/dashboard/schoolProperties.svelte';
	import DashboardLandsort from '$lib/components/layout/dashboard/DashboardLandsort.svelte';
	import CalendarLayout from '$lib/components/layout/calendar/calendarLayout.svelte';
	import NavigationCards from '$lib/components/layout/dashboard/NavigationCards.svelte';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types/navigation';

	let user: User | null = null;

	onMount(() => {
		const userData = localStorage.getItem('user');
		if (userData) {
			user = JSON.parse(userData);
		}
	});
</script>

<div class="mb-4 flex flex-col md:flex-row">
	<!-- dashboard landing -->
	<DashboardLandsort />
	<div class="flex p-6 md:w-1/3 md:p-2">
		<CalendarLayout />
	</div>
</div>

{#if user}
	<div class="mx-2 mb-4 rounded-lg border border-slate-300 bg-slate-100 p-6">
		<p class="text-lg capitalize">
			selamat datang, <strong class="text-blue-700 capitalize">{user.username}</strong>!
		</p>
		<p class="text-gray-600">
			sebagai: <strong class="text-slate-600 capitalize">{user.role}</strong>
		</p>
	</div>
{/if}

<!-- Quick Navigation Cards -->
<div class="mx-2 mb-4 rounded-xl border border-slate-200 bg-white p-6">
	<NavigationCards />
</div>

<div class="m-2 p-3">
	<SchoolProperties />
</div>
