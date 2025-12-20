<script lang="ts">
	import SchoolProperties from '$lib/components/layout/dashboard/schoolProperties.svelte';
	import DashboardLandsort from '$lib/components/layout/dashboard/DashboardLandsort.svelte';
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

<div>
	<!-- dashboard landing -->
	<DashboardLandsort />
	{#if user}
		<div class="rounded-lg border border-slate-300 bg-slate-100 p-6">
			<p class="text-lg capitalize">
				selamat datang, <strong class="text-blue-700 capitalize">{user.username}</strong>!
			</p>
			<p class="text-gray-600">
				sebagai: <strong class="text-slate-600 capitalize">{user.role}</strong>
			</p>
		</div>
	{/if}
</div>
<div class="p-3 m-2">

	<SchoolProperties />
</div>
