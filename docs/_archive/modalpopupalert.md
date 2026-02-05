# Modal Alert Component

A reusable, customizable modal alert component for displaying success, error, warning, and info messages.

## Location

```
src/lib/components/modal/modalalert.svelte
```

## Import

```svelte
<script>
	import ModalAlert from '$lib/components/modal/modalalert.svelte';
</script>
```

## Props

| Prop          | Type                                          | Default     | Description                                 |
| ------------- | --------------------------------------------- | ----------- | ------------------------------------------- |
| `show`        | `boolean`                                     | `false`     | Controls visibility of the modal            |
| `type`        | `'success' \| 'error' \| 'warning' \| 'info'` | `'success'` | Alert type that determines styling and icon |
| `message`     | `string`                                      | `''`        | The message to display in the modal         |
| `showCancel`  | `boolean`                                     | `false`     | Whether to show the cancel button           |
| `confirmText` | `string`                                      | `'OK'`      | Text for the confirm/agree button           |
| `cancelText`  | `string`                                      | `'Batal'`   | Text for the cancel button                  |

## Events

| Event        | Description                                            |
| ------------ | ------------------------------------------------------ |
| `on:confirm` | Fired when the confirm/agree button is clicked         |
| `on:cancel`  | Fired when the cancel button is clicked                |
| `on:close`   | Fired when the close (X) button or backdrop is clicked |

## Alert Types

The component supports four alert types, each with distinct styling:

| Type      | Icon          | Color Theme   |
| --------- | ------------- | ------------- |
| `success` | ✓ Checkmark   | Emerald/Green |
| `error`   | ! Exclamation | Red           |
| `warning` | ⚠ Triangle    | Amber/Yellow  |
| `info`    | ℹ Info        | Blue          |

## Basic Usage

### Simple Success Alert

```svelte
<script>
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	let showAlert = false;
</script>

<button on:click={() => (showAlert = true)}> Show Alert </button>

<ModalAlert bind:show={showAlert} type="success" message="Data saved successfully!" />
```

### Error Alert with Custom Button Text

```svelte
<ModalAlert
	bind:show={showError}
	type="error"
	message="Failed to save data. Please try again."
	confirmText="Try Again"
/>
```

### Confirmation Dialog (with Cancel Button)

```svelte
<script>
	let showConfirm = false;

	function handleConfirm() {
		console.log('User confirmed action');
		// Perform the action
	}

	function handleCancel() {
		console.log('User cancelled');
	}
</script>

<ModalAlert
	bind:show={showConfirm}
	type="warning"
	message="Are you sure you want to delete this item?"
	showCancel={true}
	confirmText="Delete"
	cancelText="Cancel"
	on:confirm={handleConfirm}
	on:cancel={handleCancel}
/>
```

### Info Alert with Close Handler

```svelte
<script>
	let showInfo = false;

	function handleClose() {
		console.log('Modal closed');
	}
</script>

<ModalAlert
	bind:show={showInfo}
	type="info"
	message="Your session will expire in 5 minutes."
	on:close={handleClose}
/>
```

## Complete Example

```svelte
<script>
	import ModalAlert from '$lib/components/modal/modalalert.svelte';

	let alertState = {
		show: false,
		type: 'success',
		message: ''
	};

	function showSuccess() {
		alertState = {
			show: true,
			type: 'success',
			message: 'Operation completed successfully!'
		};
	}

	function showError() {
		alertState = {
			show: true,
			type: 'error',
			message: 'Something went wrong. Please try again.'
		};
	}

	function showWarning() {
		alertState = {
			show: true,
			type: 'warning',
			message: 'This action cannot be undone.'
		};
	}

	function showInfo() {
		alertState = {
			show: true,
			type: 'info',
			message: 'Here is some useful information.'
		};
	}
</script>

<div class="flex gap-2">
	<button on:click={showSuccess}>Success</button>
	<button on:click={showError}>Error</button>
	<button on:click={showWarning}>Warning</button>
	<button on:click={showInfo}>Info</button>
</div>

<ModalAlert bind:show={alertState.show} type={alertState.type} message={alertState.message} />
```

## Features

- **Backdrop blur** - Semi-transparent backdrop with blur effect
- **Escape key support** - Press `Escape` to close the modal
- **Click outside to close** - Clicking the backdrop closes the modal
- **Smooth animations** - Uses Svelte `fade` and `scale` transitions
- **Accessible** - Uses `role="alertdialog"` for screen readers
- **Auto-close** - Modal automatically closes after confirm, cancel, or close actions

## Styling

The component uses Tailwind CSS classes with a dark theme (`bg-slate-800`). The icon and button colors change based on the alert `type`.

## Notes

- The modal uses `z-20` for the backdrop, ensure this doesn't conflict with other overlays
- The `show` prop is automatically set to `false` when any action button is clicked
- Use `bind:show` for two-way binding to control visibility from parent component
