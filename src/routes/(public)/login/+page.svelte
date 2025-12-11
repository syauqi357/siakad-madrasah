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
			goto('/dashboard');
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
        class="fixed top-5 right-5 z-50 flex items-center justify-between max-w-sm p-4 bg-red-500 text-white rounded-lg shadow-lg"
    >
        <span class="font-medium">{error}</span>
        <button on:click={() => showError = false} class="ml-4 text-xl font-bold leading-none">&times;</button>
    </div>
{/if}

<div class="min-h-screen flex items-center justify-center bg-linear-60 from-purple-600 to-blue-600">
	<div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
		<h1 class="text-2xl font-bold text-center mb-6">Login to School System</h1>

		<form on:submit|preventDefault={handleLogin}>
			<div class="mb-4">
				<label for="username" class="block text-gray-700 font-semibold mb-2">Username</label>
				<input
					id="username"
					bind:value={username}
					type="text"
					placeholder="admin"
					required
					disabled={loading}
					class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
				/>
			</div>

			<div class="mb-6">
				<label for="password" class="block text-gray-700 font-semibold mb-2">Password</label>
				<input
					id="password"
					bind:value={password}
					type="password"
					placeholder="admin123"
					required
					disabled={loading}
					class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Logging in...' : 'Login'}
			</button>
		</form>

		<div class="mt-6 p-4 bg-gray-100 rounded">
			<h3 class="font-semibold text-sm text-gray-600 mb-2">Demo Accounts:</h3>
			<p class="text-sm"><strong>Admin:</strong> admin / admin123</p>
			<p class="text-sm"><strong>Teacher:</strong> guru1 / guru123</p>
		</div>
	</div>
</div>