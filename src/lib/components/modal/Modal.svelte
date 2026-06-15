<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let show = false;
	export let title = '';
	export let subtitle = '';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let closeOnBackdrop = true;

	const dispatch = createEventDispatcher();

	const SIZES: Record<typeof size, string> = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg'
	};

	function close() {
		dispatch('close');
	}

	function handleBackdrop(event: MouseEvent) {
		if (closeOnBackdrop && event.target === event.currentTarget) close();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && show) close();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 100 }}
		on:click={handleBackdrop}
		role="presentation"
	>
		<!-- Panel -->
		<div
			class="flex max-h-[90vh] w-full {SIZES[size]} flex-col overflow-hidden rounded-xl bg-white shadow-xl"
			transition:fly={{ y: 20, duration: 200 }}
			role="dialog"
			aria-modal="true"
		>
			<!-- Header -->
			<div class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-3.5">
				<div class="min-w-0">
					<h2 class="text-lg font-semibold text-gray-900">{title}</h2>
					{#if subtitle}
						<p class="mt-0.5 truncate text-sm text-gray-500">{subtitle}</p>
					{/if}
				</div>
				<button
					type="button"
					aria-label="Tutup"
					on:click={close}
					class="-mr-1.5 shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Body -->
			<div class="overflow-y-auto px-5 py-5">
				<slot />
			</div>

			<!-- Action bar -->
			{#if $$slots.footer}
				<div class="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3.5">
					<slot name="footer" />
				</div>
			{/if}
		</div>
	</div>
{/if}
