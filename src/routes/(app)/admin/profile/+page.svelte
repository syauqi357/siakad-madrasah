<script lang="ts">
	import { onMount } from 'svelte';
	import ChangePassword from '$lib/components/features/profile/ChangePassword.svelte';
	import ChangeUsername from '$lib/components/features/profile/ChangeUsername.svelte';
	import { API_FETCH } from '$lib/api';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let userProfile: any = null;

	onMount(async () => {
		try {
			// Fetch user profile to trigger audit log "Viewed Auth Me"
			const response = await API_FETCH('/api/auth/me');
			if (response.ok) {
				const userProfileData = await response.json();
				userProfile = userProfileData.user;
			}
		} catch (error) {
			console.error('Failed to fetch profile:', error);
		}
	});
</script>

<div class="flex flex-col gap-6 p-5">
	{#if userProfile}
		<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
			<h2 class="mb-2 text-lg font-semibold">Profile Info</h2>
			<p class="text-slate-600">
				Username: <span class="font-medium text-slate-900">{userProfile.username}</span>
			</p>
			<p class="text-slate-600">
				Role: <span class="font-medium text-slate-900 capitalize">{userProfile.role}</span>
			</p>
		</div>
	{/if}

	<div class="flex gap-6">
		<ChangePassword />
		<ChangeUsername />
	</div>
</div>
