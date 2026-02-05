# Architecture Decision: Input Components & Styling Strategy

This document explains the reasoning behind the input component architecture, specifically why we chose to encapsulate styling within components like `PhoneInput.svelte` rather than relying on global styles or parent-controlled styling.

## 1. The Problem: "The Huge Form"
In enterprise applications (like this Academic System), forms can become massive. A single "Add Student" page might have 50+ fields.

If every input field requires 10 lines of Tailwind classes to look good (e.g., the floating label pattern), the parent file becomes unreadable:

```html
<!-- BAD: Repetitive, cluttering the parent file -->
<div class="relative w-full">
  <input class="peer w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 ease focus:border-blue-500 focus:shadow focus:outline-none hover:border-slate-300" ... />
  <label class="absolute left-2.5 top-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500" ...>Name</label>
</div>
<!-- Repeat this 50 times... -->
```

## 2. The Solution: Component Encapsulation
We move the styling and logic into a dedicated component (`PhoneInput.svelte`, `InputMapel.svelte`).

```html
<!-- GOOD: Clean, semantic, and consistent -->
<PhoneInput bind:value={phoneNumber} />
```

### Benefits
1.  **Consistency:** Every phone input in the app looks exactly the same. If we decide to change the border color to purple, we change it in *one file*, and it updates everywhere.
2.  **Readability:** The parent form file focuses on *structure* (which fields go where) rather than *style* (how many pixels of padding).
3.  **Logic Bundling:** Complex inputs like `PhoneInput` require logic (splitting country code vs. number). Bundling this logic with the style ensures they always work together.

## 3. The "Material Design" Floating Label
We chose the "Floating Label" (Outlined) style for specific UX reasons:
1.  **Space Efficiency:** It combines the label and the input into a single visual row.
2.  **Context:** The label remains visible even after typing (unlike a standard placeholder), so the user never forgets what field they are editing.
3.  **Aesthetics:** It provides a modern, polished look that users associate with high-quality software (like Google forms).

## 4. Why "Peer" Selectors?
We use Tailwind's `peer` class to style the label based on the input's state without writing custom JavaScript.
*   `peer-focus`: When input is focused -> Move label up.
*   `peer-placeholder-shown`: When input is empty -> Move label down.

This keeps the component lightweight and performant, relying on the browser's native CSS engine rather than JS event listeners for styling.
