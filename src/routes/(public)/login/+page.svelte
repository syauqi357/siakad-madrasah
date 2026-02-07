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
	let showPassword = false;

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
		}, 5000);
	}

	async function handleLogin(): Promise<void> {
		loading = true;
		error = '';
		showError = false;

		try {
			const authUrl = import.meta.env.VITE_API_URL;
			const response = await fetch(`${authUrl}/routes/api/auth/login`, {
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

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
	<div class="w-full max-w-sm">
		<!-- Error Toast -->
		{#if showError}
			<div
				transition:slide={{ duration: 300, easing: quintOut, axis: 'y' }}
				class="mb-3 flex items-center justify-between gap-3 rounded-lg bg-red-600 px-4 py-3 text-white shadow-lg"
			>
				<span class="text-sm font-medium">{error}</span>
				<button
					aria-label="Dismiss error"
					on:click={() => (showError = false)}
					class="shrink-0 rounded p-0.5 transition-colors hover:bg-red-500"
				>
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
				</button>
			</div>
		{/if}

		<div class="rounded-lg p-8 sm:border sm:border-slate-200 sm:bg-white sm:shadow-sm">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-slate-900">
				Login ke platform
			</h1>
			<span
				class="mt-1 inline-block rotate-2 rounded bg-blue-600 px-2.5 py-0.5 text-lg font-bold text-white transition-transform hover:rotate-0"
			>
				akademik
			</span>
		</div>

		<form on:submit|preventDefault={handleLogin} class="space-y-5">
			<!-- Username -->
			<div>
				<label for="username" class="mb-1.5 block text-sm font-medium text-slate-700">
					Username
				</label>
				<input
					id="username"
					bind:value={username}
					type="text"
					placeholder="admin"
					required
					disabled={loading}
					class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
				/>
			</div>

			<!-- Password -->
			<div>
				<label for="password" class="mb-1.5 block text-sm font-medium text-slate-700">
					Password
				</label>
				<input
					id="password"
					bind:value={password}
					type={showPassword ? 'text' : 'password'}
					placeholder="admin123"
					required
					disabled={loading}
					class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
				/>
				<label class="mt-2 flex items-center gap-2 text-sm text-slate-500 select-none">
					<input
						type="checkbox"
						bind:checked={showPassword}
						class="h-4 w-4 rounded border-slate-300 accent-blue-600"
					/>
					Tampilkan password
				</label>
			</div>

			<!-- Submit -->
			<button
				type="submit"
				disabled={loading}
				class="flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{#if loading}
					<div class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
				{:else}
					Login
				{/if}
			</button>
		</form>
		</div>
	</div>
</div>
