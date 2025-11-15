<script lang="ts">
	// Define the structure of a navigation item
	interface NavItem {
		name: string;
		icon: string;
		href: string;
	}

	// Props received from parent component
	export let sidebarOpen: boolean;
	export let navItems: NavItem[];
</script>

<aside
	class="fixed top-0 left-0 z-40 h-screen w-64 border-r border-neutral-500 bg-neutral-200 pt-22 transition-transform {sidebarOpen
		? 'translate-x-0'
		: '-translate-x-full'} sm:translate-x-0"
>
	<div class="h-full overflow-y-auto bg-neutral-200 px-3 pb-5">
		<ul class="space-y-2 font-medium">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						class="group flex items-center justify-between rounded-lg p-2 text-neutral-900 transition-colors hover:bg-neutral-300"
					>
						<div class="flex items-center">
							<span class="h-6 w-6">
								{@html item.icon}
							</span>
							<span class="ml-3">{item.name}</span>
						</div>
						<span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								id="Keyboard-Arrow-Right-Fill--Streamline-Rounded-Fill-Material"
								height="24"
								width="24"
							>
								<desc> Keyboard Arrow Right Fill Streamline Icon: https://streamlinehq.com </desc>
								<path
									fill="#000000"
									d="m13.24995 11.9749 -4.425 -4.425c-0.15 -0.15 -0.2208 -0.325 -0.2125 -0.525 0.00835 -0.2 0.0875 -0.375 0.2375 -0.525 0.15 -0.15 0.3292 -0.225 0.5375 -0.225 0.20835 0 0.3875 0.075 0.5375 0.225l4.95 4.95c0.08335 0.08335 0.1417 0.16665 0.175 0.25 0.03335 0.08335 0.05 0.175 0.05 0.275 0 0.1 -0.01665 0.19165 -0.05 0.275 -0.0333 0.08335 -0.09165 0.16665 -0.175 0.25l-4.975 4.975c-0.15 0.15 -0.325 0.22085 -0.525 0.2125 -0.2 -0.00835 -0.375 -0.0875 -0.525 -0.2375 -0.15 -0.15 -0.225 -0.32915 -0.225 -0.5375 0 -0.20835 0.075 -0.3875 0.225 -0.5375l4.4 -4.4Z"
									stroke-width="0.5"
								></path>
							</svg>
						</span>
					</a>
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
