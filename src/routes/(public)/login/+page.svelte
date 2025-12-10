<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types/navigation';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	interface MockUser extends User {
		password: string;
	}

	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) {
			goto('/dashboard');
		}
	});

	const mockUsers: MockUser[] = [
		{
			id: 1,
			email: 'admin@school.com',
			password: 'admin123',
			username: 'Admin User',
			role: 'admin'
		},
		{
			id: 2,
			email: 'teacher@school.com',
			password: 'teacher123',
			username: 'Teacher John',
			role: 'teacher'
		}
	];

	function handleLogin(): void {
		console.log('Login attempt:', email, password); // DEBUG
		loading = true;
		error = '';

		const foundUser = mockUsers.find(
			(u) => u.email === email && u.password === password
		);

		console.log('Found user:', foundUser); // DEBUG

		if (!foundUser) {
			error = 'Invalid email or password';
			loading = false;
			return;
		}

		const token = `fake-jwt-token-${foundUser.id}`;

		const user: User = {
			id: foundUser.id,
			username: foundUser.username,
			email: foundUser.email,
			role: foundUser.role
		};

		console.log('Saving to localStorage:', { token, user }); // DEBUG

		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));

		loading = false;

		console.log('Redirecting to dashboard...'); // DEBUG
		goto('/dashboard');
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
	<div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
		<h1 class="text-2xl font-bold text-center mb-6">Login to School System</h1>

		{#if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
				{error}
			</div>
		{/if}

		<form on:submit|preventDefault={handleLogin}>
			<div class="mb-4">
				<label for="email" class="block text-gray-700 font-semibold mb-2">Email</label>
				<input
					id="email"
					bind:value={email}
					type="email"
					placeholder="admin@school.com"
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
			<p class="text-sm"><strong>Admin:</strong> admin@school.com / admin123</p>
			<p class="text-sm"><strong>Teacher:</strong> teacher@school.com / teacher123</p>
		</div>
	</div>
</div>