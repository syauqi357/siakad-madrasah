<script lang="ts">
	export let sidebarOpen: boolean;
</script>

<nav class="fixed top-0 z-50 w-full border-b border-neutral-400 bg-white">
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center justify-start">
				<!-- Toggle sidebar button-->
				<button
					on:click={() => (sidebarOpen = !sidebarOpen)}
					class="inline-flex items-center rounded-lg p-2 text-sm text-neutral-400 hover:bg-neutral-200 focus:ring-2 focus:ring-neutral-300 focus:outline-none"
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

				<!-- nama sekolah dan logo -->
				<a href="/" class="ml-2 flex md:mr-24">
					<div class="schoolpfp"></div>

					<div class="flex flex-col justify-center">
						<span class="self-center text-xl font-semibold whitespace-nowrap text-black sm:text-2xl"
							>MyApp</span
						>
						<span class="self-center text-xl whitespace-nowrap text-black sm:text-sm">
							npsn : 12345678
						</span>
					</div>
				</a>
			</div>

			<!-- user profile -->
			<div class="flex items-center">
				<button class="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

<style>
	.schoolpfp {
		width: 32px;
		height: 32px;
		background-color: #6b7280;
		border-radius: 0.4em;
		margin: 0 1em 0 0;
	}
</style>
