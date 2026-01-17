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
		// console.log('App layout mounted'); // DEBUG

		const token = localStorage.getItem('token');
		const userData = localStorage.getItem('user');

		// console.log('Token:', token); // DEBUG
		// console.log('UserData:', userData); // DEBUG

		if (token && userData) {
			user = JSON.parse(userData) as User;
			navItems = navigationConfig[user.role] || [];

			// console.log('User:', user); // DEBUG
			// console.log('NavItems:', navItems); // DEBUG
		} else {
			// console.log('No auth, redirecting to login'); // DEBUG
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
		<div class="print:hidden">
			<Sidebar bind:sidebarOpen {navItems} bind:openDropdowns />
		</div>

		<div class="flex-1">
			<div class="print:hidden">
				<Navbar bind:sidebarOpen {user} {logout} />
			</div>

			<main class="mt-20 bg-white sm:mt-30 sm:ml-64 print:m-0 print:mt-0 print:ml-0 print:p-0">
				<slot />
			</main>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center">
				<p>Loading</p>
		<!--	loading animations	-->
		<!-- From Uiverse.io by Fresnel11 -->
		<div
			class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
		></div>
	</div>
{/if}

<style>
	@media print {
		:global(body) {
			background: white;
		}
	}
</style>
