<script lang="ts">
	export let password: string = '';

	$: requirements = [
		{ label: 'At least 6 characters', met: password.length >= 6 },
		{ label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
		{ label: 'At least one lowercase letter', met: /[a-z]/.test(password) },
		{ label: 'At least one number', met: /[0-9]/.test(password) },
		{ label: 'At least one special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
	];
</script>

<ul class="flex flex-col gap-1.5 text-sm">
	{#each requirements as req (req.label)}
		<li class="flex items-center gap-2 {req.met ? 'text-green-600' : 'text-slate-400'}">
			{#if req.met}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="#78C841"
					><path
						d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
					/></svg
				>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="#E50046"
					><path
						d="m480-424 116 116q11 11 28 11t28-11q11-11 11-28t-11-28L536-480l116-116q11-11 11-28t-11-28q-11-11-28-11t-28 11L480-536 364-652q-11-11-28-11t-28 11q-11 11-11 28t11 28l116 116-116 116q-11 11-11 28t11 28q11 11 28 11t28-11l116-116Zm0 344q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
					/></svg
				>
			{/if}
			{req.label}
		</li>
	{/each}
</ul>
