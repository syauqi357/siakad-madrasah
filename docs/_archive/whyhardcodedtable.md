# Architecture Decision: Why Hardcoded Demo Data?

You might notice that `+page.svelte` (and previously `studentScoreTable.svelte`) initializes variables with hardcoded `demoHeaders` and `demoData`. You might also notice that deleting them causes errors or a blank UI.

This document explains **why** this pattern is used and why it is a best practice for this specific use case.

## 1. The "Landing Page" User Experience (UX)
The page in question is the **Landing Page** (Root `/`). Its primary goal is to **showcase** the application to visitors immediately.

*   **Scenario A (No Demo Data):** A visitor arrives. The page is blank or shows a spinner for 2 seconds while the backend wakes up. If the backend is down, they see an error. **Result:** They leave.
*   **Scenario B (With Demo Data):** A visitor arrives. They *instantly* see a beautiful, populated table showing exactly what the app does. Then, if the backend is ready, it seamlessly swaps to live data. **Result:** Instant engagement.

## 2. Defensive Programming & Fallbacks
Frontend applications must be robust against backend failures.

*   **API Failures:** If `fetch()` fails (network error, 500 error), the application shouldn't crash or show a white screen. It should fall back to a "safe" state. In our case, the "safe state" is the Demo Mode.
*   **Empty Data:** If the database is empty (new installation), showing a blank table with no columns looks broken. Showing demo data guides the user on what *will* be there.

## 3. TypeScript & Initialization
Svelte and TypeScript require variables to be initialized, especially when used in the template.

```typescript
// BAD:
let tableData; // undefined
// HTML: {#each tableData as row} -> ERROR: Cannot read property of undefined

// GOOD:
let tableData = []; // Safe, but empty
// HTML: Renders nothing (boring)

// BEST (For Landing Page):
let tableData = demoData; // Safe AND informative
```

## 4. Why Deleting It Caused Errors
If you deleted the demo data but didn't replace it with an empty array `[]` or a proper type definition, you likely hit one of these issues:

1.  **Undefined Access:** The template tried to loop over `undefined` before the `onMount` fetch finished.
2.  **Type Errors:** TypeScript didn't know what shape `tableData` was supposed to have, causing build errors.
3.  **Logic Gaps:** The `fetch` logic relies on `usingRealData` flag. If the fetch fails, the code was designed to *keep* the existing data (which was the demo data). If you removed it, the fallback became `undefined` or empty, breaking the UI.

## 5. Alternatives (How to Remove Hardcoded Data Safely)

If you decide you **do not** want hardcoded data, here are the two professional ways to handle it:

### Option A: Skeleton Loading (The SPA Standard)
Instead of showing fake text, show gray "pulse" bars that look like data.

1.  **Initialize Empty:** `let tableData: any[] = [];`
2.  **Track Loading:** `let loading = true;`
3.  **Update HTML:**
    ```svelte
    {#if loading}
      <!-- Show 5 fake rows of gray bars -->
      {#each Array(5) as _}
        <div class="animate-pulse h-10 bg-slate-200 rounded mb-2"></div>
      {/each}
    {:else if tableData.length > 0}
      <!-- Show Real Table -->
    {:else}
      <!-- Show "No Data" Message -->
      <p>No data available.</p>
    {/if}
    ```

### Option B: Server-Side Rendering (SSR) - The SvelteKit Way
Fetch the data on the server *before* the page loads. The user never sees a loading state.

1.  **Move Logic:** Move the `fetch` code to `+page.server.ts` inside a `load` function.
2.  **Pass Data:** Return `{ tableData }` from the server.
3.  **Receive Data:** In `+page.svelte`, use `export let data;`.
4.  **Result:** The page loads instantly with real data. If the DB is empty, you handle the empty state in HTML.

## 6. Important Distinction: Landing Page vs. Dashboard

*   **Landing Page (Marketing):** Use **Demo Data**. You want to sell the "idea" of the app. Visitors know it's fake.
*   **Dashboard (Product):** Use **Empty States**. If a teacher logs in and sees "Ahmad Santoso" (who doesn't exist), they will panic and think the database is corrupted.
    *   *Correct Dashboard Behavior:* Show the headers ("Nama", "NISN") but leave the rows empty with a message: *"Belum ada data siswa. Silakan tambah siswa baru."*

**Recommendation:** For a **Landing Page**, keep the hardcoded demo data (it sells the product). For an **Admin Dashboard**, use Option A (Skeleton) or Option B (SSR).
