<script lang="ts">
	import { onMount } from 'svelte';
	import { API_FETCH } from '$lib/api';
	import NavigationScreen from './navigationScreen.svelte';
	import logo from '$lib/assets/siakadLogo.svg';
	import { goto } from '$app/navigation';

	let showNavScreen = false;

	export let sidebarOpen: boolean;
	export let user: any;
	export let logout: () => void;

	const apiUrl = import.meta.env.VITE_API_URL;

	type SchoolData = {
		name: string;
		npsn: string;
		logoUrl: string;
	};

	let showUserMenu = false;

	let schoolData: SchoolData = {
		name: '',
		npsn: '',
		logoUrl: logo
	};

	let loading = true;
	let error = false;

	onMount(async () => {
		try {
			const response = await API_FETCH('/routes/api/schoolData');

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const fetchedData = await response.json();

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

	function toggleUserMenu() {
		showUserMenu = !showUserMenu;
	}

	function handleLogout() {
		logout();
	}

	function handleAccount() {
		goto('/admin/profile');
	}

	function closeUserMenu() {
		showUserMenu = false;
	}
</script>

<nav class="fixed top-0 z-50 w-full border-b border-slate-200 bg-slate-50 shadow-sm sm:px-12">
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<!-- Toggle sidebar (mobile) -->
				<button
					on:click={() => (sidebarOpen = !sidebarOpen)}
					class="inline-flex items-center rounded-lg p-2 text-sm text-slate-500 hover:bg-slate-200 focus:ring-2 focus:ring-slate-300 focus:outline-none sm:hidden"
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

				<!-- School branding -->
				<a href="/" class="flex items-center gap-3">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
						{#if schoolData.logoUrl}
							<img src={schoolData.logoUrl} alt="School Logo" class="h-full w-full object-cover" />
						{/if}
					</div>

					<div class="flex flex-col">
						{#if loading}
							<div class="h-5 w-36 animate-pulse rounded bg-slate-200 sm:h-6 sm:w-52"></div>
							<div class="mt-1.5 h-4 w-24 animate-pulse rounded bg-slate-200 sm:w-32"></div>
						{:else}
							<span class="text-sm font-semibold text-slate-900 sm:text-lg leading-tight">
								{schoolData.name}
							</span>
							<div class="mt-0.5 flex items-center gap-1.5 text-xs uppercase text-slate-500">
								npsn :
								<span class="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
									{schoolData.npsn}
								</span>
							</div>
						{/if}
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

				<div class="hidden h-6 w-px bg-slate-300 md:block"></div>

				<!-- User profile button -->
				<button
					on:click={toggleUserMenu}
					class="flex items-center gap-3 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-200"
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
							<span class="font-medium text-slate-900">{user.username || 'User'}</span>
							<span class="text-xs text-slate-500">{user.role || 'Role'}</span>
						</div>
					{/if}
				</button>

				<!-- User Menu Dropdown -->
				{#if showUserMenu}
					<div
						aria-label="Close user menu"
						on:click={closeUserMenu}
						on:keydown={(e) => e.key === 'Escape' && closeUserMenu()}
						role="button"
						tabindex="0"
						class="fixed inset-0 z-30"
					></div>

					<div
						class="absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
					>
						<!-- Header -->
						<div class="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
							<p class="text-sm font-semibold text-slate-800">Menu</p>
							<button
								on:click={closeUserMenu}
								class="rounded p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
								aria-label="Close menu"
								title="Close menu"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<!-- User Info -->
						{#if user}
							<div class="border-b border-slate-100 px-4 py-3">
								<p class="text-sm font-semibold text-slate-900">
									{user.username || 'User'}
								</p>
								<p class="mt-0.5 text-xs text-slate-500">
									{user.email || 'N/A'}
								</p>
								<p class="mt-1.5 text-xs text-slate-500">
									Sebagai: <span class="font-medium capitalize text-slate-700">{user.role}</span>
								</p>
							</div>
						{/if}

						<!-- Menu Items -->
						<div class="flex flex-col py-1">
							<button
								on:click={handleAccount}
								class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Akun Saya
							</button>
							<button
								on:click={handleLogout}
								class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Logout
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>

<NavigationScreen bind:show={showNavScreen} on:close={() => (showNavScreen = false)} />
