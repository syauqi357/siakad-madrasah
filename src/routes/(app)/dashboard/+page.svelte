<script lang="ts">
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
	<h1 class="text-3xl font-bold mb-6">Dashboard</h1>

	{#if user}
		<div class="bg-white p-6 rounded-lg shadow">
			<p class="text-lg">Welcome back, <strong>{user.username}</strong>!</p>
			<p class="text-gray-600">Your role: <strong class="text-purple-600">{user.role}</strong></p>
		</div>
	{/if}
</div>