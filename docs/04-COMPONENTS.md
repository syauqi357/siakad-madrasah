# UI Components

## Modal Alert
**Location:** `src/lib/components/modal/modalalert.svelte`

Reusable alert/confirm modal with 4 types.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | boolean | false | Show/hide modal |
| `type` | string | 'info' | 'success' / 'error' / 'warning' / 'info' |
| `message` | string | '' | Message to display |
| `showCancel` | boolean | false | Show cancel button |
| `confirmText` | string | 'OK' | Confirm button text |
| `cancelText` | string | 'Batal' | Cancel button text |

**Events:** `confirm`, `cancel`, `close`

**Usage:**
```svelte
<ModalAlert
  show={showAlert}
  type="warning"
  message="Delete this item?"
  showCancel={true}
  on:confirm={handleDelete}
  on:cancel={() => showAlert = false}
/>
```

**Features:**
- Backdrop blur
- Escape key to close
- Click outside to close
- Accessible (focus trap)

---

## Upload Excel Modal
**Location:** `src/lib/components/modal/UploadExcel.svelte`

File upload modal for Excel imports.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Show/hide modal |

**Events:** `close`, `upload`

**Usage:**
```svelte
<UploadExcel
  isOpen={showUpload}
  on:close={() => showUpload = false}
  on:upload={handleUpload}
/>
```

---

## Fonts

**Location:** `src/lib/fonts/`

| Font | Usage |
|------|-------|
| Stack Sans | Body text |
| JetBrains Mono | Code/monospace |

**Adding New Fonts:**
1. Add font files to `src/lib/fonts/`
2. Add `@font-face` rules in `app.css`
3. Update Tailwind config if needed
