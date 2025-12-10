<script lang="ts">
	import '../app.css';
</script>

<svelte:head>
	<title>sistem Akademik </title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<div class="bg-slate-100">
	<slot />
</div>

<style>
	:global(body) {
		margin: 0;
		background-color: #0a0a0a;
	}
</style>
