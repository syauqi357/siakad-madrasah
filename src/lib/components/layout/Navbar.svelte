<script lang="ts">
	export let sidebarOpen: boolean;
</script>

<nav class="fixed top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900">
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center justify-start">
				<button
					on:click={() => (sidebarOpen = !sidebarOpen)}
					class="inline-flex items-center rounded-lg p-2 text-sm text-neutral-400 hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-700 focus:outline-none"
				>
					<span class="sr-only">Toggle sidebar</span>
					<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
						<path
							clip-rule="evenodd"
							fill-rule="evenodd"
							d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
						></path>
					</svg>
				</button>
				<a href="/" class="ml-2 flex md:mr-24">
					<span class="self-center text-xl font-semibold whitespace-nowrap text-white sm:text-2xl"
						>MyApp</span
					>
				</a>
			</div>
			<div class="flex items-center">
				<button class="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						></path>
					</svg>
				</button>
			</div>
		</div>
	</div>
</nav>