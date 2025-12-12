<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types/navigation';
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let username = '';
	let password = '';
	let error = '';
	let loading = false;
	let showError = false;
	let showPassword = false; // Variable to toggle password visibility

	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) {
			goto('/dashboard');
		}
	});

	function triggerError(message: string) {
		error = message;
		showError = true;
		setTimeout(() => {
			showError = false;
		}, 5000); // Auto-dismiss after 5 seconds
	}

	async function handleLogin(): Promise<void> {
		loading = true;
		error = '';
		showError = false;

		try {
			const authUrl = import.meta.env.VITE_API_URL;
			const response = await fetch(`${authUrl}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			if (!response.ok) {
				const errorData = await response.json();
				triggerError(errorData.message || 'Login failed');
				loading = false;
				return;
			}

			const data = await response.json();

			if (!data.success || !data.token || !data.user) {
				triggerError(data.message || 'Invalid response from server');
				loading = false;
				return;
			}

			const user: User = {
				id: data.user.id,
				username: data.user.username,
				email: data.user.email,
				role: data.user.role
			};

			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(user));

			loading = false;
			await goto('/dashboard');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'An error occurred during login';
			triggerError(message);
			loading = false;
		}
	}
</script>

<!-- Error Toast Notification -->
{#if showError}
	<div
		transition:slide={{ duration: 300, easing: quintOut, axis: 'x' }}
		class="fixed top-5 right-5 z-50 flex max-w-sm items-center justify-between rounded-lg bg-red-500 p-4 text-white shadow-lg"
	>
		<span class="font-medium">{error}</span>
		<button
			aria-label="error message"
			on:click={() => (showError = false)}
			class="ml-4 text-xl leading-none font-bold"
		>
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					id="Close-Fill--Streamline-Rounded-Fill-Material"
					height="24"
					width="24"
				>
					<path
						fill="currentColor"
						d="m12 13.0501 -5.25 5.25c-0.15 0.15 -0.325 0.225 -0.525 0.225s-0.375 -0.075 -0.525 -0.225c-0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525l5.25 -5.25 -5.25 -5.25c-0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225l5.25 5.25 5.25 -5.25c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525l-5.25 5.25 5.25 5.25c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225s-0.375 -0.075 -0.525 -0.225l-5.25 -5.25Z"
						stroke-width="0.5"
					></path>
				</svg>
			</span>
		</button>
	</div>
{/if}

<div class="flex min-h-screen items-center justify-center">
	<div
		class="w-full max-w-sm rounded-xl p-8 sm:h-fit sm:max-h-screen sm:border sm:border-slate-300 sm:bg-slate-50"
	>
		<h1 class=" flex flex-col items-center mb-6 text-center text-2xl font-bold capitalize text-2xl/9">Login ke platform <div class="transition-all ease-in-out bg-blue-600 rotate-3 hover:rotate-none text-slate-100 pl-2 pr-2 rounded-sm border border-blue-700 flex items-center w-fit">akademik</div> </h1>

		<form on:submit|preventDefault={handleLogin}>
			<div class="mb-4">
				<label for="username" class="mb-2 block font-semibold text-gray-700">Username</label>

				<!--

		id="username"
					bind:value={username}
					type="text"
					placeholder="admin"
					required
					disabled={loading}

		-->

				<input
					id="username"
					bind:value={username}
					type="text"
					placeholder="admin"
					required
					disabled={loading}
					class="w-full rounded-md border border-slate-500 px-3 py-2 outline-blue-700 transition-all ease-in-out focus:border-blue-700 focus:outline-offset-2"
				/>
			</div>

			<!--

						id="password"
					bind:value={password}
					type="password"
					placeholder="admin123"
					required
					disabled={loading}

	-->
			<div class="mb-6">
				<label for="password" class="mb-2 block font-semibold text-gray-700">Password</label>
				<input
					id="password"
					bind:value={password}
					type={showPassword ? 'text' : 'password'}
					placeholder="admin123"
					required
					disabled={loading}
					class="w-full rounded-md border border-slate-500 px-3 py-2 outline-blue-700 transition-all ease-in-out focus:border-blue-700 focus:outline-offset-2"
				/>
				<div class="text-md mt-2 flex items-center gap-2 text-gray-700">
					<input
						type="checkbox"
						bind:checked={showPassword}
						name="showPwd"
						id="showPwd"
						class="h-4 w-4 appearance-auto checked:bg-blue-500"
					/>
					<label for="showPwd"> tampilkan password </label>
				</div>
			</div>

			<!--

	type="submit"
				disabled={loading}

	-->
			<button
				type="submit"
				disabled={loading}
				class="w-full h-10 flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-all duration-200 ease-in-out hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if loading}
					<div role="status">
						<svg aria-hidden="true" class="w-6 h-6 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
						</svg>
					</div>
				{:else}
					Login
				{/if}
			</button>
		</form>
	</div>
</div>