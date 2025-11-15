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
				<a href="/" class="ml-12 flex items-center gap-4 md:mr-24">
					<div class=" shrink-0 w-12 h-12 bg-lime-600 rounded-sm flex items-center justify-center"></div>

					<div class="flex flex-col justify-center">
						<span class="mb-1 text-lg font-semibold text-black sm:text-2xl">
							<!-- {item.nameschool} -->
							SchoolSys Madrasah
						</span>
						<span class="text-sm text-black"> npsn : 12345678 </span>
					</div>
				</a>
			</div>

			<!-- user profile -->
			<div class="flex items-center">
				<!-- aria label menurut svelte harus ada : line 41 -->
				<!-- title haus ada menurut svelte : line 42 -->
				<!-- transition hover  duration-50 ease-in docs : https://tailwindcss.com/docs/transition-duration -->
				<button
					class="rounded-lg p-2 text-neutral-400 duration-50 ease-in hover:bg-neutral-500"
					aria-label="Open user menu"
					title="Open user menu"
				>
					<!-- icon user profile -->
					<!-- <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						></path>
					</svg> -->

					<svg
					class="h-7 w-7"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						id="Person-Fill--Streamline-Rounded-Fill-Material"
						height="24"
						width="24"
					>
						<desc> Person Fill Streamline Icon: https://streamlinehq.com </desc>
						<path
							fill="#000000"
							d="M12 11.9751c-1.1 0 -2 -0.35 -2.7 -1.05 -0.7 -0.7 -1.05 -1.6 -1.05 -2.7s0.35 -2 1.05 -2.7c0.7 -0.7 1.6 -1.05 2.7 -1.05s2 0.35 2.7 1.05c0.7 0.7 1.05 1.6 1.05 2.7s-0.35 2 -1.05 2.7c-0.7 0.7 -1.6 1.05 -2.7 1.05Zm-8 6.525v-0.85c0 -0.63335 0.158335 -1.175 0.475 -1.625 0.316665 -0.45 0.725 -0.79165 1.225 -1.025 1.11665 -0.5 2.1875 -0.875 3.2125 -1.125s2.05415 -0.375 3.0875 -0.375 2.05835 0.12915 3.075 0.3875c1.01665 0.25835 2.08335 0.62915 3.2 1.1125 0.51665 0.23335 0.93335 0.575 1.25 1.025 0.31665 0.45 0.475 0.99165 0.475 1.625v0.85c0 0.41665 -0.14585 0.77085 -0.4375 1.0625 -0.29165 0.29165 -0.64585 0.4375 -1.0625 0.4375H5.5c-0.41665 0 -0.770835 -0.14585 -1.0625 -0.4375 -0.291665 -0.29165 -0.4375 -0.64585 -0.4375 -1.0625Z"
							stroke-width="0.5"
						></path>
					</svg>

					
				</button>
			</div>
		</div>
	</div>
</nav>

<style>
	/* .schoolpfp {
		width: 32px;
		height: 32px;
		background-color: #6b7280;
		border-radius: 0.4em;
		flex-shrink: 0;
	} */

	 /* spot */
</style>
