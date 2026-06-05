<script lang="ts">
	import CheckIcon from '$lib/components/icons/checkIcon.svelte';
	import CrossIcon from '$lib/components/icons/crossIcon.svelte';

	export let password: string = '';

	$: Requirements = [
		{ label: 'At least 6 characters', met: password.length >= 6 },
		{ label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
		{ label: 'At least one lowercase letter', met: /[a-z]/.test(password) },
		{ label: 'At least one number', met: /[0-9]/.test(password) },
		{
			label: 'At least one special character (!@#$%^&*)',
			met: /[!@#$%^&*(),.?":{}|<>]/.test(password)
		}
	];
</script>

<ul class="flex flex-col gap-1.5 text-sm">
	{#each Requirements as requirement (requirement.label)}
		<li class="flex items-center gap-2 {requirement.met ? 'text-green-600' : 'text-slate-400'}">
			{#if requirement.met}
				<CheckIcon />
			{:else}
				<CrossIcon />
			{/if}
			{requirement.label}
		</li>
	{/each}
</ul>
