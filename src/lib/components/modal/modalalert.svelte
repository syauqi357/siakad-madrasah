<script lang="ts">
	import Success from '../icons/success.svelte';
	import WarningIcon from '../icons/warningIcon.svelte';
	import ErrorIcon from '../icons/errorIcon.svelte';

	/**
	 * Modal Alert Component
	 * @prop {boolean} show - Controls visibility of the modal
	 * @prop {'success' | 'error' | 'warning' | 'info'} type - Alert type for styling
	 * @prop {string} message - The message to display
	 * @prop {boolean} showCancel - Show cancel button (default: false)
	 * @prop {string} confirmText - Text for confirm button (default: 'OK')
	 * @prop {string} cancelText - Text for cancel button (default: 'Batal')
	 * @event onConfirm - Fired when confirm/agree button is clicked
	 * @event onCancel - Fired when cancel button is clicked
	 * @event onClose - Fired when close (X) button is clicked
	 */

	export let show = false;
	export let type = 'success'; // 'success' | 'error' | 'warning' | 'info'
	export let message = '';
	export let showCancel = false;
	export let confirmText = 'OK';
	export let cancelText = 'Batal';

	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	function handleConfirm() {
		dispatch('confirm');
		show = false;
	}

	function handleCancel() {
		dispatch('cancel');
		show = false;
	}

	function handleClose() {
		dispatch('close');
		show = false;
	}

	// Icon and color configs based on type
	const typeConfig = {
		success: {
			bgIcon: 'bg-emerald-700',
			textIcon: 'text-emerald-300',
			bgButton: 'bg-emerald-900 hover:shadow-emerald-600',
			textButton: 'text-emerald-400'
		},
		error: {
			bgIcon: 'bg-red-700',
			textIcon: 'text-red-300',
			bgButton: 'bg-red-900 hover:shadow-red-600',
			textButton: 'text-red-400'
		},
		warning: {
			bgIcon: 'bg-amber-600',
			textIcon: 'text-amber-200',
			bgButton: 'bg-amber-800 hover:shadow-amber-600',
			textButton: 'text-amber-300'
		},
		info: {
			bgIcon: 'bg-blue-700',
			textIcon: 'text-blue-300',
			bgButton: 'bg-blue-900 hover:shadow-blue-600',
			textButton: 'text-blue-400'
		}
	};

	// Get config with fallback
	function getConfig(alertType: string) {
		if (alertType === 'success') return typeConfig.success;
		if (alertType === 'error') return typeConfig.error;
		if (alertType === 'warning') return typeConfig.warning;
		if (alertType === 'info') return typeConfig.info;
		return typeConfig.success;
	}

	$: config = getConfig(type);
</script>

{#if show}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="fixed inset-0 z-20 flex items-center justify-center p-4 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		on:click={handleClose}
		on:keydown={(e) => e.key === 'Escape' && handleClose()}
		tabindex="0"
		role="presentation"
	>
		<!-- Modal -->
		<div
			class="w-full max-w-sm rounded-2xl border border-slate-500 bg-slate-800 p-4 text-white shadow-lg shadow-slate-500"
			transition:scale={{ duration: 150, start: 0.95 }}
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="alertdialog"
			tabindex="-1"
		>
			<!--main information-->
			<main class="flex w-full items-center justify-center gap-3">
				<div
					id="iconAlert"
					class="flex aspect-square w-16 shrink-0 items-center justify-center rounded-full {config.bgIcon} {config.textIcon}"
				>
					{#if type === 'success'}
						<Success />
					{:else if type === 'error'}
						<ErrorIcon />
					{:else if type === 'warning'}
						<WarningIcon />
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="28px"
							viewBox="0 0 24 24"
							width="28px"
							fill="currentColor"
						>
							<path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
							/>
						</svg>
					{/if}
				</div>
				<div id="contentAlert" class="flex-1 text-sm">{message}</div>
				<!--close button-->
				<button
					id="closeAlert"
					class="flex aspect-square w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ease-in-out hover:bg-gray-700"
					on:click={handleClose}
				>
					&#10006;
				</button>
			</main>

			<!-- action -->
			<div
				id="buttonActionalertParent"
				class="mt-4 flex w-full flex-row-reverse items-center justify-center gap-2"
			>
				{#if showCancel}
					<button
						id="cancelButton"
						class="w-full rounded-md py-2 capitalize transition-all ease-in-out hover:bg-gray-700 hover:text-red-400"
						on:click={handleCancel}
					>
						{cancelText}
					</button>
				{/if}
				<button
					id="agreeButton"
					class="w-full rounded-md {config.bgButton} py-2 {config.textButton} capitalize transition-all ease-in-out hover:shadow-lg"
					on:click={handleConfirm}
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
