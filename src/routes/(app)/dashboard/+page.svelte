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
		<div class="bg-slate-100 p-6 rounded-lg border border-slate-300">
			<p class="text-lg capitalize">selamat datang, <strong class="capitalize text-blue-700">{user.username}</strong>!</p>
			<p class="text-gray-600">sebagai: <strong class="capitalize text-slate-600">{user.role}</strong></p>
		</div>
	{/if}
</div>