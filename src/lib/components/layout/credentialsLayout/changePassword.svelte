<script lang="ts">
	import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
	import { API_FETCH } from '$lib/api.ts';
	import PassIndicatorStrength from '$lib/components/layout/credentialsLayout/passIndicatorStrength.svelte';

	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

	let showCurrentPassword = false;
	let showNewPassword = false;
	let showConfirmPassword = false;

	async function handleChangePassword() {
		errorMessage = '';
		successMessage = '';

		if (!currentPassword || !newPassword || !confirmPassword) {
			errorMessage = 'All fields are required';
			return;
		}

		if (newPassword !== confirmPassword) {
			errorMessage = 'New passwords do not match';
			return;
		}

		if (newPassword.length < 6) {
			errorMessage = 'New password must be at least 6 characters';
			return;
		}

		if (currentPassword === newPassword) {
			errorMessage = 'New password must be different from current password';
			return;
		}

		loading = true;

		try {
			const token = localStorage.getItem('token');

			const response = await API_FETCH(`/api/auth/change-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					currentPassword,
					newPassword
				})
			});

			const data = await response.json();

			if (data.success) {
				successMessage = data.message;
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			} else {
				errorMessage = data.message;
			}
		} catch (error) {
			console.error('Change password error:', error);
			errorMessage = 'Failed to change password. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<form on:submit|preventDefault={handleChangePassword} class="w-full max-w-xl">
	<h2 class="text-lg font-bold text-slate-900 sm:text-2xl">Change Password</h2>

	<div class="mt-4 space-y-4">
		<!-- Current Password -->
		<div class="flex flex-col gap-1.5">
			<label for="currentPassword" class="text-sm font-medium text-slate-700">Current Password</label>
			<div class="flex items-center rounded-lg border border-slate-300 transition-colors focus-within:border-slate-500">
				<input
					class="w-full rounded-lg p-2.5 text-sm outline-none"
					type={showCurrentPassword ? 'text' : 'password'}
					id="currentPassword"
					placeholder="Enter current password"
					bind:value={currentPassword}
					disabled={loading}
				/>
				<button
					type="button"
					on:click={() => (showCurrentPassword = !showCurrentPassword)}
					class="flex h-9 w-9 shrink-0 items-center justify-center text-slate-400 hover:text-slate-600"
				>
					<EyeIcon open={showCurrentPassword} />
				</button>
			</div>
		</div>

		<!-- New Password -->
		<div class="flex flex-col gap-1.5">
			<label for="newPassword" class="text-sm font-medium text-slate-700">New Password</label>
			<div class="flex items-center rounded-lg border border-slate-300 transition-colors focus-within:border-slate-500">
				<input
					type={showNewPassword ? 'text' : 'password'}
					class="w-full rounded-lg p-2.5 text-sm outline-none"
					id="newPassword"
					placeholder="Enter new password"
					bind:value={newPassword}
					disabled={loading}
				/>
				<button
					type="button"
					on:click={() => (showNewPassword = !showNewPassword)}
					class="flex h-9 w-9 shrink-0 items-center justify-center text-slate-400 hover:text-slate-600"
				>
					<EyeIcon open={showNewPassword} />
				</button>
			</div>
			<PassIndicatorStrength password={newPassword} />
		</div>

		<!-- Confirm New Password -->
		<div class="flex flex-col gap-1.5">
			<label for="confirmPassword" class="text-sm font-medium text-slate-700">Confirm New Password</label>
			<div class="flex items-center rounded-lg border border-slate-300 transition-colors focus-within:border-slate-500">
				<input
					type={showConfirmPassword ? 'text' : 'password'}
					id="confirmPassword"
					class="w-full rounded-lg p-2.5 text-sm outline-none"
					placeholder="Re-enter new password"
					bind:value={confirmPassword}
					disabled={loading}
				/>
				<button
					type="button"
					on:click={() => (showConfirmPassword = !showConfirmPassword)}
					class="flex h-9 w-9 shrink-0 items-center justify-center text-slate-400 hover:text-slate-600"
				>
					<EyeIcon open={showConfirmPassword} />
				</button>
			</div>
		</div>

		<!-- Messages -->
		{#if errorMessage}
			<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
				{errorMessage}
			</div>
		{/if}

		{#if successMessage}
			<div class="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
				{successMessage}
			</div>
		{/if}

		<!-- Submit -->
		<button
			type="submit"
			disabled={loading}
			class="w-full rounded-lg bg-blue-600 p-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{#if loading}
				<span class="flex items-center justify-center gap-2">
					<div class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
					Mengubah...
				</span>
			{:else}
				Change Password
			{/if}
		</button>
	</div>
</form>
