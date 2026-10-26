# Native first, with a fallback

- Every component is a real HTML element underneath (`input`, `select`, `button`, `details`, `dialog`, `meter`, ...).
- Without JavaScript it must still work: native controls, content stacked in order, forms that submit. Without newer CSS it falls back to HTML defaults.
- The script only enhances. Guard newer CSS with `@supports` and give a fallback value.
- Components are configured from HTML attributes (`data-*`) and optional `<simar-*>` tags (`src/tags.js`).
- Fonts default to the visitor's own system fonts; load nothing unless a font is chosen. Code always uses a monospace font.
