<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	let sidebarOpen = false;

	const navItems = [
		{
			name: 'Dashboard',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M4.5 20.9999c-0.416665 0 -0.770835 -0.14585 -1.0625 -0.4375 -0.291665 -0.29165 -0.4375 -0.64585 -0.4375 -1.0625v-1.9l4 -3.55v6.95H4.5Zm3.5 0v-4h8v4H8Zm9 0v-8.2l-4.275 -3.8 3.025 -2.675 4.75 4.225c0.16665 0.15 0.29165 0.32085 0.375 0.5125 0.08335 0.19165 0.125 0.39585 0.125 0.6125v7.825c0 0.41665 -0.14585 0.77085 -0.4375 1.0625 -0.29165 0.29165 -0.64585 0.4375 -1.0625 0.4375h-2.5Zm-14 -4.75v-4.575c0 -0.21665 0.041665 -0.425 0.125 -0.625 0.083335 -0.2 0.208335 -0.36665 0.375 -0.5l7.5 -6.65c0.13335 -0.13333 0.2875 -0.229165 0.4625 -0.2875 0.175 -0.05833 0.35415 -0.0875 0.5375 -0.0875 0.18335 0 0.3625 0.02917 0.5375 0.0875 0.175 0.058335 0.32915 0.15417 0.4625 0.2875l2 1.775 -12 10.575Z" stroke-width="0.5"></path></svg>',
			href: '/'
		},
		{
			name: 'Rombel',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M4 19.5V4.5c0 -0.4125 0.146915 -0.765665 0.44075 -1.0595C4.734415 3.146835 5.0875 3 5.5 3h13c0.4125 0 0.76565 0.146835 1.0595 0.4405C19.85315 3.734335 20 4.0875 20 4.5v6.75c0 0.4125 -0.14685 0.7656 -0.4405 1.05925 -0.29385 0.29385 -0.647 0.44075 -1.0595 0.44075H5.5v2.625h5c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125H5.5V19.5h5c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125H5.5c-0.4125 0 -0.765585 -0.1469 -1.05925 -0.44075C4.146915 20.2656 4 19.9125 4 19.5Zm11.85 -0.65 3.275 -3.275c0.15 -0.15 0.325 -0.22085 0.525 -0.2125 0.2 0.00835 0.375 0.0875 0.525 0.2375 0.15 0.15 0.225 0.32915 0.225 0.5375 0 0.20835 -0.075 0.3875 -0.225 0.5375l-3.8 3.8c-0.15 0.15 -0.325 0.225 -0.525 0.225s-0.375 -0.075 -0.525 -0.225l-1.8 -1.8c-0.15 -0.15 -0.22085 -0.32915 -0.2125 -0.5375 0.00835 -0.20835 0.0875 -0.3875 0.2375 -0.5375 0.15 -0.15 0.32915 -0.225 0.5375 -0.225 0.20835 0 0.3875 0.075 0.5375 0.225l1.225 1.25ZM5.5 11.25h5.75v-2.625H5.5v2.625Zm7.25 0H18.5v-2.625H12.75v2.625ZM5.5 7.125h5.75V4.5H5.5v2.625Zm7.25 0H18.5V4.5H12.75v2.625Z" stroke-width="0.5"></path></svg>',
			href: '/rombel'
		},
		{
			name: 'Analytics',
			icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>',
			href: '/analytics'
		},
		{
			name: 'Settings',
			icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>',
			href: '/settings'
		}
	];
</script>

<svelte:head>
	<title>MyApp</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Navbar -->
	<!-- component navbar
 
Layout Component Structure Explanation
Looking at your +layout.svelte file, here's how the navbar integrates and relates to your project structure:

How the Navbar Works
The navbar is a reusable component that:

Receives state: bind:sidebarOpen creates a two-way binding, so the navbar can toggle the sidebar state
Controls UI: When users interact with the navbar (e.g., click a menu button), it updates sidebarOpen in the parent layout
Triggers sidebar: The sidebar listens to the same sidebarOpen variable and shows/hides accordingly
Component Relationships Across Folders
Your typical SvelteKit project structure likely looks like this:

Key relationships:

+layout.svelte = Root layout wrapping all pages with persistent navbar/sidebar
Navbar.svelte = Imported component that manages top navigation UI
Sidebar.svelte = Imported component that displays navigation items
<slot /> = Placeholder where page-specific content renders from +page.svelte files in nested routes
 
 -->
	<Navbar bind:sidebarOpen />
	<!-- Sidebar -->

	<!-- 
	
		The Sidebar component is included here in the layout.
		It also uses the sidebarOpen variable to determine visibility.
		It receives navItems as props to render navigation links.

		documentation : 
		https://svelte.dev/tutorial/component-props

		generate in claudeAi 

	-->
	<Sidebar bind:sidebarOpen {navItems} />

	<div class="p-4 sm:ml-64">
		<div class="mt-21 p-4">

			<!-- position of pages -->
			<slot />
		</div>
	</div>
</div>

{#if sidebarOpen}

<!-- fix some issues : nambah div close tag -->
	<div
		class="bg-opacity-50 fixed inset-0 z-30 bg-black sm:hidden"
		on:click={() => (sidebarOpen = false)}
		on:keydown={(e) => e.key === 'Escape' && (sidebarOpen = false)}
		role="button"
		tabindex="-1"
	></div>
{/if}

<style>
	:global(body) {
		margin: 0;
		background-color: #0a0a0a;
	}
</style>
