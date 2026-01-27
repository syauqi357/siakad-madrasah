# Font Style Guide & Configuration

This document explains how fonts are configured in the application, specifically focusing on the custom body font (**Stack Sans**) and the monospace font (**JetBrains Mono**) used for code blocks.

## 1. Font Files Location

All local font files are stored in:
`src/lib/fonts/`

*   **Body Font:** `src/lib/fonts/StackSansText-*.woff2`
*   **Monospace Font:** `src/lib/fonts/monospace_fonts/JetBrainsMono-*.woff2`

## 2. CSS Configuration (`src/app.css`)

We use standard CSS `@font-face` rules to load these fonts and assign them to font families.

### Body Font: Stack Sans
We map different font weights (Light, Regular, Medium, Bold) to the same family name `StackSansText-*` (or custom names as implemented) to control the visual hierarchy.

```css
@font-face {
    font-family: 'StackSansText-Regular';
    src: url('/src/lib/fonts/StackSansText-Regular.woff2') format('woff2');
    font-weight: 300;
    font-style: normal;
}
/* ... other weights ... */

body {
    font-family: 'StackSansText-light', sans-serif;
}
```

### Monospace Font: JetBrains Mono
We use **JetBrains Mono** for all code-related elements. This is configured to use the local files instead of a CDN for better performance and privacy.

```css
@font-face {
    font-family: 'JetBrains Mono';
    src: url('/src/lib/fonts/monospace_fonts/JetBrainsMono-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: 'JetBrains Mono';
    src: url('/src/lib/fonts/monospace_fonts/JetBrainsMono-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
}
/* ... Italic and Medium weights are also defined ... */
```

## 3. Applying Fonts to Markdown (Tailwind Typography)

We use the `@tailwindcss/typography` plugin to style Markdown content (like this documentation). By default, it uses a generic monospace font. We override this in `src/app.css` to force it to use our custom JetBrains Mono.

```css
/* Custom Typography Overrides */
.prose code,
.prose pre {
    font-family: 'JetBrains Mono', monospace !important;
}
```

*   **`.prose code`**: Targets inline code snippets (e.g., `const x = 1`).
*   **`.prose pre`**: Targets multi-line code blocks.
*   **`!important`**: Ensures this rule overrides Tailwind's default typography styles.

## 4. How to Add New Fonts

1.  **Download:** Get the `.woff2` files for your font.
2.  **Place:** Put them in `src/lib/fonts/`.
3.  **Define:** Add a new `@font-face` rule in `src/app.css`.
4.  **Apply:** Use the `font-family` name in your CSS rules or Tailwind config.
