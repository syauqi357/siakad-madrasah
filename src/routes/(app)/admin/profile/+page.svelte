<script lang="ts">
import { onMount } from 'svelte';
import ChangePassword from '$lib/components/layout/credentialsLayout/changePassword.svelte';
import ChangeUsername from '$lib/components/layout/credentialsLayout/changeUsername.svelte';
import { API_FETCH } from '$lib/api';

let userProfile: any = null;

onMount(async () => {
    try {
        // Fetch user profile to trigger audit log "Viewed Auth Me"
        const response = await API_FETCH('/api/auth/me');
        if (response.ok) {
            const data = await response.json();
            userProfile = data.user;
        }
    } catch (error) {
        console.error('Failed to fetch profile:', error);
    }
});

</script>

<div class="p-5 flex flex-col gap-6">
    {#if userProfile}
        <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <h2 class="text-lg font-semibold mb-2">Profile Info</h2>
            <p class="text-slate-600">Username: <span class="font-medium text-slate-900">{userProfile.username}</span></p>
            <p class="text-slate-600">Role: <span class="font-medium text-slate-900 capitalize">{userProfile.role}</span></p>
        </div>
    {/if}

    <div class="flex gap-6 ">
         <ChangePassword />
         <ChangeUsername/>
    </div>
</div>
