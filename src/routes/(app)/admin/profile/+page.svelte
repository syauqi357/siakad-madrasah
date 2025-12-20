<script lang="ts">
import { onMount } from 'svelte';
import ChangePassword from '$lib/components/layout/credentialsLayout/changePassword.svelte';
import ChangeUsername from '$lib/components/layout/credentialsLayout/changeUsername.svelte';
</script>
<div class="p-5 flex">
     <ChangePassword />
     <!-- <changeUsername /> -->
     <ChangeUsername/>
</div>
