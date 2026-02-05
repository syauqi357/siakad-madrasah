# How to Create a "Numbers Only" Text Input

Here is the simple trick we used to make an input that looks like text (keeps 0s like "0812") but refuses to accept letters!

## 1. The Problem

If you use `<input type="number">`:

- The browser adds up/down arrows (spinners).
- It deletes leading zeros (e.g., if you type `0123`, it becomes `123`).

If you use `<input type="text">`:

- It accepts everything (A-Z, symbols).

## 2. The Solution

We use `type="text"` but we put a "Bouncer" at the door. Every time you type a character, the "Bouncer" checks it immediately.

### The Code (The Bouncer)

We added this small function in the `<script>`:

```javascript
const onlyNumbers = (e) => {
	// 1. Get the element you are typing in
	const target = e.target;

	// 2. "Replace" anything that is NOT a number with "nothing"
	target.value = target.value.replace(/[^0-9]/g, '');
};
```

### Breaking it Down

- `/[^0-9]/g` is a **Regex** (Regular Expression). It's a pattern matcher.
- `^0-9` means "NOT a number (0-9)".
- So the computer says: _"Find everything that is NOT a number, and replace it with empty string (delete it)."_

## 3. Connecting it (HTML)

We added `on:input={onlyNumbers}` to your inputs:

```svelte
<input type="text" on:input={onlyNumbers} placeholder="NIK" />
```

Now, the moment you press a key, if it's "A", the function runs, sees it's not a number, and instantly deletes it. It happens so fast you don't even see the letter appear! logic!
