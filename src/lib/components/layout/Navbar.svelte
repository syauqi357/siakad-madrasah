<script lang="ts">
	/*

Summary of Changes:
	1. Import the Logo: I added import logo from '$lib/assets/favicon.svg'; at the top of the script.
        This makes the SVG available as a variable named logo which holds the correct (public) path to the image.
	2. Update Initial Data: I changed logoUrl: '$lib/assets/favicon.svg' to logoUrl: logo.
   	   This ensures that even before your API call finishes, the component will display the imported logo.
	3. Handle Fetched Data: In the onMount function, I've updated the logic slightly.
	   When you get data from your API, it will use the logoUrl from the API if it exists. If the API doesn't return a logoUrl,
        it will fall back to using the logo you imported. This makes your component more robust.

		// generate by gemini

	*/
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import NavigationScreen from './navigationScreen.svelte';

	// importing logo by default
	import logo from '$lib/assets/favicon.svg';

	// Navigation screen state
	let showNavScreen = false;

	// sidebar function to trigger sidebar
	export let sidebarOpen: boolean;

	// User and logout function
	export let user: any;
	export let logout: () => void;

	// api variable
	const apiUrl = import.meta.env.VITE_API_URL;

	// Define a type for our school data for better type-safety.
	type SchoolData = {
		name: string;
		npsn: string;
		logoUrl: string;
	};

	// Local state for user menu dropdown
	let showUserMenu = false;

	// placeholder loading set json control
	let schoolData: SchoolData = {
		name: '<div class="w-55 h-7 rounded-lg bg-slate-300 animate-pulse"></div>',
		npsn: '<div class="w-40 h-5 rounded-sm bg-slate-300 animate-pulse"></div>',
		logoUrl: logo
	};

	let loading = true;
	let error = false;

	onMount(async () => {
		try {
			// endpoint app.js
			// docs : pending

			const response = await API_FETCH('/routes/api/schoolData');
			//get API from backend using express from localhost:3000/api/schoolAdministrativeData and this is taking a variable const on the file

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// fetch data dari appjs endpoint server
			const fetchedData = await response.json();

			// sukses ambil data dari appjs endpoint server
			schoolData = {
				name: fetchedData.name,
				npsn: fetchedData.npsn,
				logoUrl: fetchedData.logoUrl ? `${apiUrl}/${fetchedData.logoUrl}` : logo
			};

			loading = false;
		} catch (err) {
			console.error('Failed to fetch school data:', err);
			error = true;
			loading = false;
		}
	});

	// Toggle user menu visibility
	function toggleUserMenu() {
		showUserMenu = !showUserMenu;
	}

	// Handle logout
	function handleLogout() {
		logout();
	}

	// Close menu when clicking outside
	function closeUserMenu() {
		showUserMenu = false;
	}
</script>

<nav class="fixed top-0 z-50 w-full border-b border-neutral-400 bg-slate-100 sm:pr-12 sm:pl-12">
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center justify-start">
				<!-- Toggle sidebar button-->
				<button
					on:click={() => (sidebarOpen = !sidebarOpen)}
					class="inline-flex items-center rounded-lg p-2 text-sm text-neutral-400 hover:bg-neutral-200 focus:ring-2 focus:ring-neutral-300 focus:outline-none sm:hidden"
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
				<a href="/" class="ml-2 flex items-center gap-4 md:mr-24">
					<!-- profile school data -->
					<div class=" flex h-12 w-12 shrink-0 items-center justify-center rounded-sm">
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
						<span class="mb-0.3 text-md font-semibold text-black sm:text-xl">
							{@html schoolData.name}
							<!-- <div class="w-55 h-7 rounded-lg bg-slate-300 animate-pulse"></div> -->
						</span>
						<span class="text-sm text-black">
							<!-- npsn layout positioning -->
							<div class="flex flex-row items-center gap-2 p-0.5 text-xs uppercase sm:text-sm">
								npsn :
								<!-- school npsn number -->
								<div class="rounded-md border border-slate-400 bg-slate-300 p-0.5 pr-2 pl-2">
									{@html schoolData.npsn}
								</div>
							</div>
						</span>
					</div>
				</a>
			</div>

			<!-- Quick Navigation & User Profile -->
			<div class="relative flex items-center gap-2">
				<!-- Quick Navigation Button -->
				<button
					on:click={() => (showNavScreen = true)}
					class="flex items-center gap-2 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-200"
					aria-label="Navigasi Cepat"
					title="Navigasi Cepat"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						/>
					</svg>
					<span class="hidden text-sm font-medium md:block">Menu</span>
				</button>

				<!-- Divider -->
				<div class="hidden h-6 w-px bg-slate-300 md:block"></div>
				<!-- aria label menurut svelte harus ada : line 41 -->
				<!-- title harus ada menurut svelte : line 42 -->
				<!-- transition hover  duration-50 ease-in docs : https://tailwindcss.com/docs/transition-duration -->
				<button
					on:click={toggleUserMenu}
					class="flex items-center gap-3 rounded-lg p-2 text-neutral-600 transition-colors duration-50 ease-in hover:bg-slate-200"
					aria-label="Open user menu"
					title="Open user menu"
				>
					<svg
						class="h-7 w-7"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						id="Person-Fill--Streamline-Rounded-Fill-Material"
						height="24"
						width="24"
					>
						<path
							fill="#000000"
							d="M12 11.9751c-1.1 0 -2 -0.35 -2.7 -1.05 -0.7 -0.7 -1.05 -1.6 -1.05 -2.7s0.35 -2 1.05 -2.7c0.7 -0.7 1.6 -1.05 2.7 -1.05s2 0.35 2.7 1.05c0.7 0.7 1.05 1.6 1.05 2.7s-0.35 2 -1.05 2.7c-0.7 0.7 -1.6 1.05 -2.7 1.05Zm-8 6.525v-0.85c0 -0.63335 0.158335 -1.175 0.475 -1.625 0.316665 -0.45 0.725 -0.79165 1.225 -1.025 1.11665 -0.5 2.1875 -0.875 3.2125 -1.125s2.05415 -0.375 3.0875 -0.375 2.05835 0.12915 3.075 0.3875c1.01665 0.25835 2.08335 0.62915 3.2 1.1125 0.51665 0.23335 0.93335 0.575 1.25 1.025 0.31665 0.45 0.475 0.99165 0.475 1.625v0.85c0 0.41665 -0.14585 0.77085 -0.4375 1.0625 -0.29165 0.29165 -0.64585 0.4375 -1.0625 0.4375H5.5c-0.41665 0 -0.770835 -0.14585 -1.0625 -0.4375 -0.291665 -0.29165 -0.4375 -0.64585 -0.4375 -1.0625Z"
							stroke-width="0.5"
						></path>
					</svg>
					{#if user}
						<div class="hidden flex-col text-left text-sm leading-tight sm:flex">
							<span class="font-medium text-black">{user.username || 'User'}</span>
							<span class="text-xs text-neutral-600">{user.role || 'Role'}</span>
						</div>
					{/if}
				</button>

				<!-- User Menu Dropdown -->
				{#if showUserMenu}
					<div
						aria-label="pop up user menu"
						on:click={closeUserMenu}
						on:keydown={(e) => e.key === 'Escape' && closeUserMenu()}
						role="button"
						tabindex="0"
						class="fixed inset-0 z-30 sm:hidden"
					></div>

					<div
						class="absolute right-0 z-50 mt-30 w-48 rounded-lg border border-neutral-300 bg-white shadow-lg"
					>
						<!-- Close Button Header -->
						<div class="flex items-center justify-between border-b border-neutral-200 px-4 py-2">
							<p class="text-sm font-semibold text-neutral-900">Menu</p>
							<button
								on:click={closeUserMenu}
								class="text-neutral-500 transition-colors hover:text-neutral-700"
								aria-label="Close menu"
								title="Close menu"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<!-- User Info Header -->
						{#if user}
							<div class="border-b border-neutral-200 px-4 py-3">
								<p class="text-sm font-semibold text-neutral-900">
									{user.username || 'User'}
								</p>
								<p class="mt-1 text-xs text-neutral-600">
									{user.email || 'N/A'}
								</p>
								<p class="mt-1 text-xs text-neutral-500 capitalize">
									sebagai: <span class="font-medium text-neutral-700">{user.role}</span>
								</p>
							</div>
						{/if}

						<!-- Menu Items -->
						<div class="flex items-center justify-center py-2">
							<button
								on:click={handleLogout}
								class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
							>
								<svg
									class="h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Logout
							</button>
							<a href="/admin/profile">
								<button
									class="flex w-full px-4 py-2 text-blue-500 capitalize transition-all ease-in-out hover:bg-blue-200"
								>
									akun
								</button>
							</a>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>

<!-- Navigation Screen Modal -->
<NavigationScreen bind:show={showNavScreen} on:close={() => (showNavScreen = false)} />
