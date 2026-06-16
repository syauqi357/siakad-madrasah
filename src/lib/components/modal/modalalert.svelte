<script lang="ts">
	import Success from '../icons/success.svelte';
	import WarningIcon from '../icons/warningIcon.svelte';
	import ErrorIcon from '../icons/errorIcon.svelte';
	import { fade, scale } from 'svelte/transition';

	// 1. Interface Props & Events digabung (Svelte 5 way!)
	interface ModalAlertProps {
		show?: boolean;
		type?: 'success' | 'error' | 'warning' | 'info';
		message: string;
		showCancel?: boolean;
		confirmText?: string;
		cancelText?: string;
		// Event dispatcher diganti menjadi callback function
		onConfirm?: () => void;
		onCancel?: () => void;
		onClose?: () => void;
	}

	// 2. Gunakan Rune $props()
	// Kita pakai $bindable() pada 'show' karena komponen ini mengubah nilai 'show' menjadi false saat ditutup
	let {
		show = $bindable(false),
		type = 'success',
		message,
		showCancel = false,
		confirmText = 'OK',
		cancelText = 'Batal',
		onConfirm,
		onCancel,
		onClose
	}: ModalAlertProps = $props();

	function handleConfirm() {
		if (onConfirm) onConfirm();
		show = false;
	}

	function handleCancel() {
		if (onCancel) onCancel();
		show = false;
	}

	function handleClose() {
		if (onClose) onClose();
		show = false;
	}

	// 3. Setup Konfigurasi Styling
	type AlertType = NonNullable<ModalAlertProps['type']>;

	interface ConfigValues {
		bgIcon: string;
		textIcon: string;
		bgButton: string;
		textButton: string;
	}

	const typeConfig: Record<AlertType, ConfigValues> = {
		success: {
			bgIcon: 'bg-emerald-700',
			textIcon: 'text-emerald-500',
			bgButton: 'bg-emerald-900 hover:shadow-emerald-600',
			textButton: 'text-emerald-400'
		},
		error: {
			bgIcon: 'bg-red-700',
			textIcon: 'text-red-500',
			bgButton: 'bg-red-900 hover:shadow-red-600',
			textButton: 'text-red-400'
		},
		warning: {
			bgIcon: 'bg-amber-600',
			textIcon: 'text-amber-500',
			bgButton: 'bg-amber-800 hover:shadow-amber-600',
			textButton: 'text-amber-300'
		},
		info: {
			bgIcon: 'bg-blue-700',
			textIcon: 'text-blue-500',
			bgButton: 'bg-blue-900 hover:shadow-blue-600',
			textButton: 'text-blue-400'
		}
	};

	// 4. Reactive statement diganti dengan Rune $derived
	let config = $derived(typeConfig[type] || typeConfig.success);
</script>

{#if show}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="fixed inset-0 z-20 flex items-center justify-center p-4 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={handleClose}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		tabindex="0"
		role="presentation"
	>
		<div
			class="w-full max-w-sm rounded-xl border border-slate-500 bg-slate-800 p-4 text-white shadow-lg shadow-slate-500"
			transition:scale={{ duration: 150, start: 0.95 }}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="alertdialog"
			tabindex="-1"
		>
			<main class="flex w-full items-center justify-center gap-3">
				<div
					id="iconAlert"
					class="flex aspect-square w-16 items-center justify-center rounded-md [&>svg]:h-9 [&>svg]:w-9 {config.textIcon}"
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
							viewBox="0 0 24 24"
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
				<button
					id="closeAlert"
					class="flex aspect-square w-10 shrink-0 items-center justify-center rounded-md transition-all ease-in-out hover:bg-gray-700"
					onclick={handleClose}
				>
					&#10006;
				</button>
			</main>

			<div
				id="buttonActionalertParent"
				class="mt-4 flex w-full flex-row-reverse items-center justify-center gap-2"
			>
				{#if showCancel}
					<button
						id="cancelButton"
						class="w-full rounded-sm py-2 capitalize transition-all ease-in-out hover:bg-gray-700 hover:text-red-400"
						onclick={handleCancel}
					>
						{cancelText}
					</button>
				{/if}
				<button
					id="agreeButton"
					class="w-full rounded-sm {config.bgButton} py-2 {config.textButton} capitalize transition-all ease-in-out hover:shadow-lg"
					onclick={handleConfirm}
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}