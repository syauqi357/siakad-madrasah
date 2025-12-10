<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types/navigation';

	let username = '';
	let password = '';
	let error = '';
	let loading = false;

	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) {
			goto('/dashboard');
		}
	});

	async function handleLogin(): Promise<void> {
		console.log('Login attempt:', username, password); // DEBUG
		loading = true;
		error = '';

		try {
			// Call backend API
			const response = await fetch('http://localhost:3000/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username,
					password
				})
			});

			console.log('Response status:', response.status); // DEBUG

			if (!response.ok) {
				const errorData = await response.json();
				error = errorData.message || 'Login failed';
				loading = false;
				return;
			}

			const data = await response.json();
			console.log('Login response:', data); // DEBUG

			if (!data.success || !data.token || !data.user) {
				error = data.message || 'Invalid response from server';
				loading = false;
				return;
			}

			const user: User = {
				id: data.user.id,
				username: data.user.username,
				email: data.user.email,
				role: data.user.role
			};

			console.log('Saving to localStorage:', { token: data.token, user }); // DEBUG

			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(user));

			loading = false;

			console.log('Redirecting to dashboard...'); // DEBUG
			goto('/dashboard');
		} catch (err) {
			console.error('Login error:', err); // DEBUG
			error = err instanceof Error ? err.message : 'An error occurred during login';
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-linear-60 from-purple-600 to-blue-600">
	<div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
		<h1 class="text-2xl font-bold text-center mb-6">Login to School System</h1>

		{#if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
				{error}
			</div>
		{/if}

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