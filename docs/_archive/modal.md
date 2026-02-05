# Modal Component Documentation

This document describes the implementation of the popup modal used for uploading Excel files in the application.

## Component: `UploadExcel.svelte`

**Location:** `src/lib/components/layout/upload/uploadExcel.svelte`

This component renders a modal dialog with a file input specifically designed for Excel files (`.xlsx`, `.xls`).

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | `false` | Controls the visibility of the modal. |

### Events

| Event | Detail | Description |
| :--- | :--- | :--- |
| `close` | `null` | Dispatched when the user clicks the close button or "Batal". |
| `upload` | `FormData` | Dispatched when the form is submitted. Contains the file data. |

### Usage Example

```svelte
<script>
  import UploadExcel from '$lib/components/layout/upload/uploadExcel.svelte';

  let isModalOpen = false;

  function handleUpload(event) {
    const formData = event.detail;
    const file = formData.get('file');
    console.log('File to upload:', file);
    
    // Perform API call here
  }
</script>

<button on:click={() => isModalOpen = true}>Open Modal</button>

<UploadExcel 
  isOpen={isModalOpen} 
  on:close={() => isModalOpen = false} 
  on:upload={handleUpload} 
/>
```

## Integration in `src/routes/(app)/siswa/+page.svelte`

The modal is integrated into the student list page to allow bulk uploading of student data.

### Key Changes

1.  **State Management:**
    Added `let isUploadModalOpen = false;` to track the modal's state.

2.  **Event Handling:**
    Added `handleUpload` function to process the `upload` event from the component.

    ```typescript
    async function handleUpload(event: CustomEvent<FormData>) {
        const formData = event.detail;
        // API logic goes here
    }
    ```

3.  **Template:**
    *   The "Upload Excel" button now triggers `isUploadModalOpen = true`.
    *   The `<UploadExcel />` component is placed in the markup, bound to the state and event handlers.

    ```svelte
    <button
        type="button"
        class="..."
        on:click={() => (isUploadModalOpen = true)}
    >
        <UploadIcon />upload excel
    </button>

    <UploadExcel 
        isOpen={isUploadModalOpen} 
        on:close={() => (isUploadModalOpen = false)} 
        on:upload={handleUpload} 
    />
    ```
