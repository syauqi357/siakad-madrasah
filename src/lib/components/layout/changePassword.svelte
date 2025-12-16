<script>

	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

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
					'Authorization': `Bearer ${token}`
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

<div>
	<h2>Change Password</h2>

	<form on:submit|preventDefault={handleChangePassword}>
		<div>
			<label for="currentPassword">Current Password</label>
			<input
				type="password"
				id="currentPassword"
				bind:value={currentPassword}
				disabled={loading}
			/>
		</div>

		<div>
			<label for="newPassword">New Password</label>
			<input
				type="password"
				id="newPassword"
				bind:value={newPassword}
				disabled={loading}
			/>
		</div>

		<div>
			<label for="confirmPassword">Confirm New Password</label>
			<input
				type="password"
				id="confirmPassword"
				bind:value={confirmPassword}
				disabled={loading}
			/>
		</div>

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		{#if successMessage}
			<p class="success">{successMessage}</p>
		{/if}

		<button type="submit" disabled={loading}>
			{loading ? 'Changing...' : 'Change Password'}
		</button>
	</form>
</div>