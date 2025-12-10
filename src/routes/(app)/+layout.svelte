<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import { navigationConfig } from '$lib/config/navigation';
	import type { User, NavItem } from '$lib/types/navigation';

	let sidebarOpen = false;
	let openDropdowns: Record<string, boolean> = {};
	let user: User | null = null;
	let navItems: NavItem[] = [];

	onMount(() => {
		console.log('App layout mounted'); // DEBUG

		const token = localStorage.getItem('token');
		const userData = localStorage.getItem('user');

		console.log('Token:', token); // DEBUG
		console.log('UserData:', userData); // DEBUG

		if (token && userData) {
			user = JSON.parse(userData) as User;
			navItems = navigationConfig[user.role] || [];

			console.log('User:', user); // DEBUG
			console.log('NavItems:', navItems); // DEBUG
		} else {
			console.log('No auth, redirecting to login'); // DEBUG
			goto('/login');
		}
	});

	function logout(): void {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		goto('/login');
	}
</script>

{#if user}
	<div class="flex min-h-screen">
		<Sidebar bind:sidebarOpen={sidebarOpen} {navItems} bind:openDropdowns />

		<div class="flex-1">
			<Navbar bind:sidebarOpen {user} {logout} />

			<main class="p-6 sm:ml-64 sm:mt-20 bg-white">
				<slot />
			</main>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-screen">
		<p>Loading...</p>
	</div>
{/if}