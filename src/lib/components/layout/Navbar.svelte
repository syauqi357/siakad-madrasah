<script lang="ts">
	/*
	
	Summary of Changes:
1. Import the Logo: I added import logo from '$lib/assets/favicon.svg'; at the top of the script. 
   This makes the SVG available as a variable named logo which holds the correct public path to the image.
2. Update Initial Data: I changed logoUrl: '$lib/assets/favicon.svg' to logoUrl: logo.
   This ensures that even before your API call finishes, the component will display the imported logo.
3. Handle Fetched Data: In the onMount function, I've updated the logic slightly. 
When you get data from your API, it will use the logoUrl from the API if it exists. If the API doesn't return a logoUrl, 
it will fall back to using the logo you imported. This makes your component more robust.
	
	*/
	import { onMount } from 'svelte';

	// importing logo by default
	import logo from '$lib/assets/favicon.svg';

	// sidebar function to trigger sidebar
	export let sidebarOpen: boolean;

	// Define a type for our school data for better type-safety.
	type SchoolData = {
		name: string;
		npsn: string;
		logoUrl: string;
	};

	let schoolData: SchoolData = {
		name: 'Loading...',
		npsn: '...',
		logoUrl: logo
	};

	let loading = true;
	let error = false;

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:3000/schoolData');
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const fetchedData = await response.json();
			
			schoolData = {
				name: fetchedData.name || 'Unknown School',
				npsn: fetchedData.npsn || '000000000',
				logoUrl: fetchedData.logoUrl ? `http://localhost:3000/${fetchedData.logoUrl}` : logo
			};
			
			loading = false;
		} catch (err) {
			console.error('Failed to fetch school data:', err);
			error = true;
			loading = false;
			
			// Fallback data
			// schoolData = {
			// 	name: 'MTs. Persis 2 Bangil',
			// 	npsn: '231698134',
			// 	logoUrl: logo
			// };
		}
	});
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
					<!-- profile school data -->
					<div class=" flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-lime-600">
						<!-- logic and layout to put the data fetch up -->
						{#if schoolData.logoUrl}
							<img src={schoolData.logoUrl} alt="School Logo" class="h-full w-full object-cover" />
						{:else}
							<!-- Placeholder if no logo -->
							<!-- use svg :) -->
						{/if}
					</div>

					<!-- nama sekolah and npsn number -->
					<div class="flex flex-col justify-center">
						<!-- school name -->
						<span class="mb-0.3 text-lg font-semibold text-black sm:text-2xl">
							{schoolData.name}
						</span>
						<span class="text-sm text-black">
							<!-- npsn layout positioning -->
							<div class="flex flex-row items-center gap-2 p-0.5">
								npsn :
								<!-- school npsn number -->
								<div class="rounded-md bg-slate-300 p-0.5 pr-2 pl-2">
									{schoolData.npsn}
								</div>
							</div>
						</span>
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
