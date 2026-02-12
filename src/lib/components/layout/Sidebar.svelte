<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';

	interface NavItem {
		name: string;
		icon?: string;
		href: string;
		hasDropdown?: boolean;
		children?: Array<{
			name: string;
			icon?: string;
			href: string;
		}>;
	}

	export let sidebarOpen: boolean;
	export let navItems: NavItem[];
	export let openDropdowns: Record<string, boolean> = {};

	$: currentPath = $page.url.pathname;

	function isActive(path: string, href: string, exact = false): boolean {
		if (href === '/' || exact) return path === href;
		return path === href || path.startsWith(href + '/');
	}

	function isChildActive(path: string, item: NavItem, childHref: string): boolean {
		if (!item.children) return path === childHref;
		// If other siblings share a prefix, use exact match for the shortest href
		const hasMoreSpecificSibling = item.children.some(
			(c) => c.href !== childHref && c.href.startsWith(childHref + '/')
		);
		return hasMoreSpecificSibling ? path === childHref : isActive(path, childHref);
	}

	function isParentActive(path: string, item: NavItem): boolean {
		if (!item.children) return false;
		return item.children.some((child) => isChildActive(path, item, child.href));
	}

	function toggleDropdown(itemName: string) {
		openDropdowns[itemName] = !openDropdowns[itemName];
	}

	// Auto-open dropdown if a child route is active
	$: if (currentPath) {
		for (const item of navItems) {
			if (item.hasDropdown && item.children) {
				if (item.children.some((child) => isChildActive(currentPath, item, child.href))) {
					openDropdowns[item.name] = true;
				}
			}
		}
	}
</script>

<!-- Backdrop for mobile -->
{#if sidebarOpen}
	<div
		role="button"
		tabindex="0"
		aria-label="Close sidebar"
		class="fixed inset-0 z-30 bg-black/75 backdrop-blur-sm sm:hidden"
		transition:fade={{ duration: 200 }}
		on:click={() => (sidebarOpen = false)}
		on:keydown={(e) => e.key === 'Escape' && (sidebarOpen = false)}
	></div>
{/if}

<aside
	class="fixed top-0 left-0 z-40 h-screen w-64 border-r border-slate-200 bg-slate-50 pt-22 shadow-lg transition-transform {sidebarOpen
		? 'translate-x-0'
		: '-translate-x-full'} sm:translate-x-0"
>
	<div class="flex h-full flex-col overflow-y-auto px-3 pb-5">
		<ul class="flex-1 space-y-1 font-medium">
			{#each navItems as item (item.name)}
				<li>
					{#if item.hasDropdown && item.children}
						<!-- Parent item with dropdown -->
						<button
							on:click={() => toggleDropdown(item.name)}
							class="sidebar-item group flex w-full items-center justify-between rounded-lg p-2 text-sm hover:bg-blue-600 hover:text-slate-100 {isParentActive(
								currentPath,
								item
							)
								? 'active bg-blue-500 font-medium text-slate-100'
								: openDropdowns[item.name]
									? 'bg-slate-100 font-semibold text-slate-900'
									: 'text-slate-600'}"
						>
							<div class="flex items-center justify-center">
								<span
									class="h-6 w-6 transition-transform duration-200 {openDropdowns[item.name]
										? 'scale-110'
										: ''}"
								>
									{@html item.icon || ''}
								</span>
								<span class="ml-3 capitalize">{item.name}</span>
							</div>
							<span
								class="transform transition-transform duration-300 ease-in-out {openDropdowns[
									item.name
								]
									? 'rotate-180'
									: 'rotate-0'}"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</span>
						</button>

						<!-- Dropdown menu -->
						{#if openDropdowns[item.name]}
							<div transition:slide={{ duration: 250, easing: quintOut }}>
								<ul class="mt-1 ml-4 space-y-0.5 border-l border-slate-300 pl-3">
									{#each item.children as child, i (child.name)}
										<li
											in:fly={{ x: -8, duration: 200, delay: 40 * i, easing: quintOut }}
											class="transition-all duration-200 hover:translate-x-1"
										>
											<a
												href={child.href}
												class="sidebar-item block rounded-lg p-2 text-sm capitalize hover:bg-blue-600 hover:text-slate-100 {isChildActive(
													currentPath,
													item,
													child.href
												)
													? 'active bg-blue-500 font-semibold text-slate-100'
													: 'text-slate-500'}"
											>
												<span>
													{child.icon || ''}
												</span>
												{child.name}
											</a>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					{:else}
						<!-- Regular menu item without dropdown -->
						<a
							href={item.href}
							class="sidebar-item group flex items-center justify-between rounded-lg p-2 text-sm hover:bg-blue-600 hover:text-slate-100 {isActive(
								currentPath,
								item.href
							)
								? 'active bg-blue-500 font-semibold text-slate-100'
								: 'text-slate-600'}"
						>
							<div class="flex items-center justify-center">
								<span
									class="h-6 w-6 transition-transform duration-200 {isActive(currentPath, item.href)
										? 'scale-110'
										: 'group-hover:scale-110'}"
								>
									{@html item.icon || ''}
								</span>
								<span class="ml-3">{item.name}</span>
							</div>
						</a>
					{/if}
				</li>
			{/each}
		</ul>

		<!-- Additional Sidebar Section -->
		<div class="mt-auto space-y-1 border-t border-slate-200 pt-4">
			<a
				href="/Documentations"
				class="flex items-center rounded-lg p-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					></path>
				</svg>
				<span class="ml-3">Documentation</span>
			</a>
			<a
				href="/support"
				class="flex items-center rounded-lg p-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
					></path>
				</svg>
				<span class="ml-3">Support</span>
			</a>
		</div>
	</div>
</aside>

<style>
	.sidebar-item {
		position: relative;
		isolation: isolate;
		transition:
			background-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
			color 300ms cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.sidebar-item::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(
			to right,
			rgb(109 40 217 / 0.35) 0%,
			transparent 50%
		);
		opacity: 0;
		z-index: -1;
		transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
	}

	.sidebar-item:global(.active)::before {
		opacity: 1;
	}

	.sidebar-item:global(.active) {
		box-shadow:
			0 1px 1px 0 rgb(59 130 246 / 0.3),
			inset 1px 0 1px -2px rgb(109 40 217 / 0.25);
	}
</style>
