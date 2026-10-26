# Adding a component

Aim: a user never needs another library. Build once, then re-check each spec every few months.

1. Start from the native HTML element or the ARIA pattern; note the spec in the section's text.
2. Styles in `scss/components/_name.scss`, added to `scss/simar-ui.scss`; behavior in `src/simar-ui.js` (claimed once, so `init()` can run again); optional tag in `src/tags.js`.
3. Demo section in `index.html` with `data-example` snippets (Tag, HTML) and a link in the contents list, in the right group (Getting started, Customize, Content, Forms, Components).
4. Tests in `tests/` (keyboard, names, states) plus the axe and contrast runs; add the component to the screenshot script and the README.
5. Run `npm test`, then commit. Do one component at a time and check in between.
