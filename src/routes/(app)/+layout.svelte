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
		const token = localStorage.getItem('token');
		const userData = localStorage.getItem('user');

		if (token && userData) {
			user = JSON.parse(userData) as User;
			navItems = navigationConfig[user.role] || [];
		} else {
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
	<div class="min-h-screen bg-slate-50">
		<div class="print:hidden">
			<Navbar bind:sidebarOpen {user} {logout} />
			<Sidebar bind:sidebarOpen {navItems} bind:openDropdowns />
		</div>

		<main class="pt-18 sm:ml-64 print:m-0 print:p-0">
			<slot />
		</main>
	</div>
{:else}
	<div class="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
		<div class="h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600"></div>
		<p class="text-sm text-slate-500">Loading...</p>
	</div>
{/if}

<style>
	@media print {
		:global(body) {
			background: white;
		}
	}
</style>
