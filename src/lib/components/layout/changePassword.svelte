<script lang="ts">
	import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
	import PassIndicatorStrength from '$lib/components/layout/passIndicatorStrength.svelte';

	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

	// let show password toggles
	let showCurrentPassword = false;
	let showNewPassword = false;
	let showConfirmPassword = false;

	// handle change password
	// Password strength checks (reactive)
	$: hasMinLength = newPassword.length >= 6;
	$: hasUpperCase = /[A-Z]/.test(newPassword);
	$: hasLowerCase = /[a-z]/.test(newPassword);
	$: hasNumber = /[0-9]/.test(newPassword);
	$: hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

	async function handleChangePassword() {
		// Reset messages
		errorMessage = '';
		successMessage = '';

		// Validation
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
			// Get token from localStorage (or wherever you store it)
			const token = localStorage.getItem('token');

			const apiUrl = import.meta.env.VITE_API_URL;
			const response = await fetch(`${apiUrl}/api/auth/change-password`, {
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
				// Clear form
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

<div class="flex gap-3">
	
	<!-- form -->
	<form on:submit|preventDefault={handleChangePassword}>
		<h2 class="text-md flex items-center  font-bold sm:text-2xl">Change Password</h2>
		<section class=" w-full  p-3 sm:w-xl">
			<div class="">
				<div class="flex flex-col gap-2  p-2">
					<label for="currentPassword">Current Password</label>
					<div class="flex rounded-md border border-gray-400">
						<input
							class="flex w-full flex-row p-2 outline-none"
							type={showCurrentPassword ? 'text' : 'password'}
							id="currentPassword"
							bind:value={currentPassword}
							disabled={loading}
						/>
						<button
							type="button"
							on:click={() => (showCurrentPassword = !showCurrentPassword)}
							class="flex px-2 text-sm items-center w-9 h-9 m-1"
						>
							<EyeIcon open={showCurrentPassword} />
							<!-- {showCurrentPassword ? '👁️' : '👁️‍🗨️'} -->
						</button>
					</div>
				</div>

				<!-- 
				
				id and label : currentPassword label content : Current Password
				type : password
				bind:value={currentPassword}
				disabled={loading}
	
				-->
			</div>

			<div>
				<div class="flex flex-col gap-2 p-2">
					<label for="newPassword">New Password</label>
					<div class="flex rounded-md border border-gray-400">
						<input
							type={showNewPassword ? 'text' : 'password'}
							class="flex w-full flex-row p-2 outline-none"
							id="newPassword"
							bind:value={newPassword}
							disabled={loading}
						/>
						<button
							type="button"
							on:click={() => (showNewPassword = !showNewPassword)}
							class="flex px-2 text-sm items-center w-9 h-9 m-1"
						>
							<EyeIcon open={showNewPassword} />
						</button>
					</div>

					<!-- Password requirements -->
					 <PassIndicatorStrength password={newPassword} ></PassIndicatorStrength>
				</div>

				<!-- 
	
				id and label : newPassword label content : New Password
				type : password
				bind:value={newPassword}
				disabled={loading}
	
				-->
			</div>

			<div>
				<div class="flex flex-col gap-2 p-2">
					<label for="confirmPassword">Confirm New Password</label>
					<div class="flex rounded-md border border-gray-400">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id="confirmPassword"
							class="flex w-full flex-row p-2 outline-none"
							bind:value={confirmPassword}
							disabled={loading}
						/>
						<button
							type="button"
							on:click={() => (showConfirmPassword = !showConfirmPassword)}
class="flex px-2 text-sm items-center w-9 h-9 m-1"
						>
							<EyeIcon open={showConfirmPassword} />
						</button>
					</div>
				</div>
				<!-- 
	
				id and label : confirmPassword label content : Confirm New Password
				type : password
				bind:value={confirmPassword}
				disabled={loading}
	
				-->
			</div>

			{#if errorMessage}
				<div class="error flex items-center justify-center bg-amber-600 p-2">{errorMessage}</div>
			{/if}

			{#if successMessage}
				<div class="success">{successMessage}</div>
			{/if}
			<!-- button submit change password -->
			<button type="submit" disabled={loading} class="mt-3 rounded-md bg-blue-600 p-2 w-full text-white">
				{loading ? 'Changing...' : 'Change Password'}
			</button>
		</section>
	</form>
	<div>

	</div>
</div>
