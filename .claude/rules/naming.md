# One vocabulary

The library started with instrument-panel (music hardware) words and has grown well past it. Names for classes,
custom properties, attributes, tags, tokens and docs must all come from one shared vocabulary, so a word means one
thing everywhere and a reader can guess the next name.

- The single source is the glossary below. Before adding a name, find the word here. If the concept is new, add it to
  the glossary first (in the same change), then use it everywhere: SCSS, JS, tags, docs text, tests and the README.
- One concept, one word. Never two names for the same thing (no `knob` in one place and `dial` in another for the same
  part), and never the same word for two things.
- Same shape everywhere: classes are BEM (`block__part--variant`); custom properties are `--group-part`, with the group
  being a glossary word (`--cap-top`, `--lit-ink`); attributes are `data-*` in kebab-case, with the same name as the
  matching tag attribute (`data-lit` / `lit`); JS functions are `enhanceThing`.
- Tag names are `simar-` plus the component word, and their attributes use the same words as the HTML, ARIA and the
  glossary (`label`, `value`, `variant`), not new synonyms.
- Do not rename existing public names (classes, tokens, attributes) casually: this is a published library. A rename needs
  a deliberate change: add the new name, keep the old as an alias, note it in the README, and plan a major version.
- When in doubt, prefer the word the web platform already uses (HTML, ARIA, CSS) over an invented one.

## Glossary (current words, from the code)

| Word | Means |
|---|---|
| panel | a grouped area that holds controls (fieldset); `sheet` is a floating panel (dialog); `sheet--bottom` docks it to the screen bottom |
| well | the socket a key or control sits in (recessed in the styles that have depth) |
| key / cap | a pressable control; the `cap` is its raised top (`--cap-*`); a `key-group` is keys joined in one well |
| latch | a key held down in its selected state (`--latch-*`) |
| lit | the highlight color and everything derived from it (`--lit`, `--lit-ink`, `--lit-fill`, `--lit-glow`) |
| accent | the call-to-action color, derived from lit |
| fader / knob / rknob / range2 | the slider, the dial, the two-handle dial, the two-handle slider |
| lcd | a small readout screen |
| groove, tick, grip, knurl, dish, metal, arc | the fine parts of faders and knobs (`--groove-*`, `--metal-*`) |
| ink | text color (`--ink`, `--ink-soft`, `--ink-disabled`); `on-*` is text on a colored surface |
| surface / sheet | page and floating backgrounds (`--surface-*`, `--sheet-*`) |
| input / field / form | text-like controls, a labelled control with its hint and error, and the form |
| hairline, lip, wall, shade, tint | edges, light rims, extrusion sides, and the shadow and highlight mixers |
| searchbar | the native `<search>` landmark with a search field, a Clear key and a Search key (`searchbar__field`, `searchbar__clear`) |
| timepicker | a time field with a clock key that opens a popover of hour, minute and AM or PM keys (`timepicker__button`, `timepicker__pop`) |
| picker, suggest, menu, tabs, tooltip | list-style components; `suggest` is autocomplete suggestions |
| quote, blurb, media, card, timeline, list, prose, lead, display | content blocks and type styles; `media` is a figure holding an image, video or audio; `card` is an article with media, body and footer; `timeline` is an ordered list of events or steps on a rail; `list` is a styled `<ul>`, `<ol>` or `<dl>` |
| bottom-nav, appbar | a bar of main places at the screen bottom (`bottom-nav__list`, keys like pagination); a bar kept at the top or bottom of its scroll area |
| swipe-list | rows whose actions a swipe, or the row's Actions key, reveals (`swipe-list__main`, `swipe-list__actions`, `swipe-list__toggle`) |
| chip | a small key that filters (checkbox), chooses (radio) or holds a value with a Remove key (`chip--input`, `chip__remove`) |
| speed-dial | a floating button that opens a short list of actions (`speed-dial__list`; a native `details`) |
| fab, side-menu | a floating button fixed to a screen corner; an edge tab that opens a panel beside it (`side-menu__toggle`, `side-menu__panel`) |
| container, row, col, d-*, gap-* | layout, named after Bootstrap's grid |

## Known to tidy (open items)

Mixed-in words that don't yet fit the vocabulary, to be reconciled under the rule above: `sheet` (a dialog and a
background token), `day`/`cal`/`daterange` (calendar words), `check`/`switch` (should read as keys), `loader` vs
`spinner`, and `.sent` (a form's confirmation). Audit them together before the next major version.
