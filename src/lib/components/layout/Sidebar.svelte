<script lang="ts">
	// Define the structure of a navigation item
	interface NavItem {
		name: string;
		icon?: string;
		href: string;

		// statement to declare the dropdown
		hasDropdown?: boolean;
		children?: Array<{
			name: string;
			icon?: string;
			href: string;
		}>;
	}

	// Props received from parent component
	export let sidebarOpen: boolean;
	export let navItems: NavItem[];

	// Local state to track which dropdowns are open
	let openDropdowns: Record<string, boolean> = {};

	function toggleDropdown(itemName: string) {
		openDropdowns[itemName] = !openDropdowns[itemName];
	}
</script>

<!-- Backdrop for mobile -->
{#if sidebarOpen}
	<div aria-roledescription="background navigation"
		class="fixed inset-0 z-30 bg-black/75 backdrop-blur-sm sm:hidden"
		on:click={() => (sidebarOpen = false)}
	></div>
{/if}

<aside
	class="fixed top-0 left-0 z-40 h-screen w-64 border-r border-neutral-500 bg-neutral-200 pt-22 transition-transform {sidebarOpen
		? 'translate-x-0'
		: '-translate-x-full'} sm:translate-x-0"
>
	<div class="h-full overflow-y-auto bg-neutral-200 px-3 pb-5">
		<ul class="space-y-2 font-medium">
			{#each navItems as item}
				<li>
					{#if item.hasDropdown && item.children}
						<!-- Parent item with dropdown -->
						<button
							on:click={() => toggleDropdown(item.name)}
							class="group flex w-full items-center justify-between rounded-lg p-2 text-neutral-900 transition-all duration-200 hover:bg-neutral-300 {openDropdowns[
								item.name
							]
								? 'bg-neutral-200'
								: ''}"
						>
							<div class="flex items-center justify-center">
								<span
									class="h-6 w-6 transition-transform duration-200 {openDropdowns[item.name]
										? 'scale-110'
										: ''}"
								>
									{@html item.icon || ''}
								</span>
								<span class="capitalize ml-3">{item.name}</span>
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

						<!-- Dropdown menu with slide animation -->
						<div
							class="overflow-hidden transition-all duration-300 ease-in-out {openDropdowns[
								item.name
							]
								? 'max-h-96 opacity-100'
								: 'max-h-0 opacity-0'}"
						>
							<ul class="mt-2 ml-3 space-y-1 border-l-2 border-neutral-300 pl-3">
								{#each item.children as child}
									<li class="transform transition-all duration-200 hover:translate-x-1">
										<a
											href={child.href}
											class="capitalize block rounded-lg p-2 text-sm text-neutral-700 transition-all duration-200 hover:bg-neutral-200 hover:font-medium hover:text-neutral-900"
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
					{:else}
						<!-- Regular menu item without dropdown -->
						<a
							href={item.href}
							class="group flex items-center justify-between rounded-lg p-2 text-neutral-900 transition-all duration-200 hover:translate-x-1 hover:bg-neutral-300"
						>
							<div class="flex items-center justify-center">
								<span class="capitalize h-6 w-6 transition-transform duration-200 group-hover:scale-110">
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
		<div class="mt-4 space-y-2 border-t border-neutral-500 pt-4">
			<a
				href="/docs"
				class="flex items-center rounded-lg p-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800"
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
				class="flex items-center rounded-lg p-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800"
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
